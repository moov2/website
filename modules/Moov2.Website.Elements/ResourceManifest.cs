using Orchard.UI.Resources;

namespace Moov2.Website.Elements {
    public class ResourceManifest : IResourceManifestProvider {
        public void BuildManifests(ResourceManifestBuilder builder) {
            var manifest = builder.Add();
            manifest.DefineScript("Moov2.Website.Layouts.Models").SetUrl("Models.min.js", "Models.js").SetDependencies("Layouts.LayoutEditor");
            manifest.DefineScript("Moov2.Website.Layouts.LayoutEditors").SetUrl("LayoutEditor.min.js", "LayoutEditor.js").SetDependencies("Layouts.LayoutEditor", "Moov2.Website.Layouts.Models");
        }
    }
}