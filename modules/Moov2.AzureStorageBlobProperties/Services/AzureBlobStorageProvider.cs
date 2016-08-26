using Microsoft.WindowsAzure.Storage.Blob;
using Orchard.Azure.Services.Environment.Configuration;
using Orchard.Azure.Services.FileSystems;
using Orchard.Environment.Configuration;
using Orchard.Environment.Extensions;
using Orchard.FileSystems.Media;
using System;
using System.IO;
using System.Web;

namespace Moov2.AzureStorageBlobProperties.Services
{
    [OrchardSuppressDependency("Orchard.Azure.Services.FileSystems.Media.AzureBlobStorageProvider")]
    public class AzureBlobStorageProvider : AzureFileSystem, IStorageProvider
    {
        private readonly IMimeTypeProvider _mimeTypeProvider;

        protected string _cacheControl;

        public AzureBlobStorageProvider(ShellSettings shellSettings, IMimeTypeProvider mimeTypeProvider, IPlatformConfigurationAccessor pca)
            : this(pca.GetSetting(Orchard.Azure.Constants.MediaStorageStorageConnectionStringSettingName, shellSettings.Name, null),
                   Orchard.Azure.Constants.MediaStorageDefaultContainerName,
                   pca.GetSetting(Orchard.Azure.Constants.MediaStorageRootFolderPathSettingName, shellSettings.Name, null) ?? shellSettings.Name,
                   mimeTypeProvider,
                   pca.GetSetting(Orchard.Azure.Constants.MediaStoragePublicHostName, shellSettings.Name, null))
        {
            if (pca != null && shellSettings != null)
            {
                _cacheControl = pca.GetSetting(Constants.MediaStorageCacheControlName, shellSettings.Name, null);
            }
        }

        private AzureBlobStorageProvider(string storageConnectionString, string containerName, string rootFolderPath, IMimeTypeProvider mimeTypeProvider, string publicHostName)
            : base(storageConnectionString, containerName, rootFolderPath, false, mimeTypeProvider, publicHostName) {
            _mimeTypeProvider = mimeTypeProvider;
        }

        public bool TrySaveStream(string path, Stream inputStream)
        {
            try
            {
                if (FileExists(path))
                {
                    return false;
                }

                SaveStream(path, inputStream);
            }
            catch
            {
                return false;
            }

            return true;
        }

        private static string ConvertToRelativeUriPath(string path)
        {
            var newPath = path.Replace(@"\", "/");

            if (newPath.StartsWith("/") || newPath.StartsWith("http://") || newPath.StartsWith("https://"))
            {
                throw new ArgumentException("Path must be relative");
            }

            return newPath;
        }

        new public IStorageFile CreateFile(string path)
        {
            path = ConvertToRelativeUriPath(path);

            if (Container.BlobExists(String.Concat(_root, path)))
            {
                throw new ArgumentException("File " + path + " already exists");
            }

            // create all folder entries in the hierarchy
            int lastIndex;
            var localPath = path;
            while ((lastIndex = localPath.LastIndexOf('/')) > 0)
            {
                localPath = localPath.Substring(0, lastIndex);
                var folder = Container.GetBlockBlobReference(String.Concat(_root, Combine(localPath, FolderEntry)));
                folder.OpenWrite().Dispose();
            }

            var blob = Container.GetBlockBlobReference(String.Concat(_root, path));
            var contentType = _mimeTypeProvider.GetMimeType(path);
            if (!String.IsNullOrWhiteSpace(contentType))
            {
                blob.Properties.ContentType = contentType;
            }

            if (!String.IsNullOrWhiteSpace(_cacheControl))
            {
                blob.Properties.CacheControl = _cacheControl;
            }

            blob.UploadFromStream(new MemoryStream(new byte[0]));
            return new AzureBlobFileStorage(blob, _absoluteRoot);
        }

        public void SaveStream(string path, Stream inputStream)
        {
            // Create the file. The CreateFile() method will map the still relative path.
            var file = CreateFile(path);

            using (var outputStream = file.OpenWrite())
            {
                var buffer = new byte[8192];
                while (true)
                {
                    var length = inputStream.Read(buffer, 0, buffer.Length);
                    if (length <= 0)
                        break;
                    outputStream.Write(buffer, 0, length);
                }
            }
        }

        /// <summary>
        /// Retrieves the local path for a given URL within the storage provider.
        /// </summary>
        /// <param name="url">The public URL of the media.</param>
        /// <returns>The corresponding local path.</returns>
        public string GetStoragePath(string url)
        {
            if (url.StartsWith(_absoluteRoot))
            {
                return HttpUtility.UrlDecode(url.Substring(Combine(_absoluteRoot, "/").Length));
            }

            return null;
        }

        public string GetRelativePath(string path)
        {
            return GetPublicUrl(path);
        }

        private class AzureBlobFileStorage : IStorageFile
        {
            private CloudBlockBlob _blob;
            private readonly string _rootPath;

            public AzureBlobFileStorage(CloudBlockBlob blob, string rootPath)
            {
                _blob = blob;
                _rootPath = rootPath;
            }

            public string GetPath()
            {
                return _blob.Uri.ToString().Substring(_rootPath.Length).Trim('/');
            }

            public string GetName()
            {
                return Path.GetFileName(GetPath());
            }

            public long GetSize()
            {
                return _blob.Properties.Length;
            }

            public DateTime GetLastUpdated()
            {
                _blob.FetchAttributes();
                return _blob.Properties.LastModified.GetValueOrDefault().DateTime;
            }

            public string GetFileType()
            {
                return Path.GetExtension(GetPath());
            }

            public Stream OpenRead()
            {
                return _blob.OpenRead();
            }

            public Stream OpenWrite()
            {
                return _blob.OpenWrite();
            }

            public Stream CreateFile()
            {
                // as opposed to the File System implementation, if nothing is done on the stream
                // the file will be emptied, because Azure doesn't implement FileMode.Truncate
                _blob.DeleteIfExists();
                _blob = _blob.Container.GetBlockBlobReference(_blob.Uri.ToString());
                _blob.UploadFromStream(new MemoryStream(new byte[0]));
                return OpenWrite();
            }
        }
    }

}