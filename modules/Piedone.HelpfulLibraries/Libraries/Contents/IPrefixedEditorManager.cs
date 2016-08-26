﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Orchard;
using Orchard.ContentManagement;

namespace Piedone.HelpfulLibraries.Libraries.Contents
{
    public interface IPrefixedParent
    {
        IContent Content { get; }
        string Prefix { get; }
    }

    /// <summary>
    /// PrefixedEditorManager makes it possible to have multiple content item editors on the same page (even nesting them) by prefixing their fields with the content item IDs.
    /// 
    /// PrefixedEditorManager is a contribution of Onestop Internet, Inc. (http://www.onestop.com/).
    /// </summary>
    public interface IPrefixedEditorManager : IDependency
    {
        IEnumerable<int> ItemIds { get; }

        /// <summary>
        /// Builds a content shape that contains the necessary prefix
        /// </summary>
        /// <param name="content">The content object to use</param>
        /// <param name="shapeFactory">Factory delegate to create the editor shape for the content object</param>
        /// <returns>The prefixed shape (multiple such shapes can be used on the same page)</returns>
        dynamic BuildShape(IContent content, Func<IContent, dynamic> shapeFactory);

        /// <summary>
        /// Updates a content whose editor was previously built with IPrefixedEditorManager with the updater
        /// </summary>
        /// <param name="content">The content object to use</param>
        /// <param name="updater">The updater to update the content with</param>
        /// <param name="groupId">Optional editor group ID</param>
        /// <returns>The updated editor shape</returns>
        dynamic UpdateEditor(IContent content, IUpdateModel updater, string groupId = "");

        /// <summary>
        /// Updates a content whose editor was previously built with IPrefixedEditorManager with the updater
        /// </summary>
        /// <param name="content">The content object to use</param>
        /// <param name="prefixedParents">To be used if this content's editor was wrapped into the prefixed editor of a parent. Specify all the parents, starting from the outer most.</param>
        /// <param name="updater">The updater to update the content with</param>
        /// <param name="groupId">Optional editor group ID</param>
        /// <returns>The updated editor shape</returns>
        dynamic UpdateEditor(IContent content, IEnumerable<IPrefixedParent> prefixedParents, IUpdateModel updater, string groupId = "");
    }


    public static class PrefixedEditorManagerExtensions
    {
        /// <summary>
        /// Builds content shapes that contain the necessary prefix
        /// </summary>
        /// <param name="contents">The content objects to use</param>
        /// <param name="shapeFactory">Factory delegate to create the editor shape for the content objects</param>
        /// <returns>The prefixed shapes (multiple such shapes can be used on the same page)</returns>
        public static IEnumerable<dynamic> BuildShapes(this IPrefixedEditorManager prefixedEditorManager, IEnumerable<IContent> contents, Func<IContent, dynamic> shapeFactory)
        {
            return contents.Select(content => prefixedEditorManager.BuildShape(content, shapeFactory)); ;
        }

        /// <summary>
        /// Updates contents whose editor was previously built with IPrefixedEditorManager with the updater
        /// </summary>
        /// <param name="contents">The content objects to use</param>
        /// <param name="updater">The updater to update the contents with</param>
        /// <param name="groupId">Optional editor group ID</param>
        /// <returns>The updated editor shapes</returns>
        public static IEnumerable<dynamic> UpdateEditors(this IPrefixedEditorManager prefixedEditorManager, IEnumerable<IContent> contents, IUpdateModel updater, string groupId = "")
        {
            var shapes = new List<dynamic>();

            foreach (var content in contents)
            {
                shapes.Add(prefixedEditorManager.UpdateEditor(content, updater, groupId));
            }

            return shapes;
        }

        /// <summary>
        /// Updates contents whose editor was previously built with IPrefixedEditorManager with the updater
        /// </summary>
        /// <param name="contents">The content objects to use</param>
        /// <param name="prefixedParents">To be used if the contents' editor was wrapped into the prefixed editor of parents. Specify all the parents, starting from the outer most for each item.</param>
        /// <param name="updater">The updater to update the contents with</param>
        /// <param name="groupId">Optional editor group ID</param>
        /// <returns>The updated editor shapes</returns>
        public static IEnumerable<dynamic> UpdateEditors(this IPrefixedEditorManager prefixedEditorManager, IEnumerable<IContent> contents, IEnumerable<IEnumerable<IPrefixedParent>> prefixedParents, IUpdateModel updater, string groupId = "")
        {
            var shapes = new List<dynamic>();
            var parents = prefixedParents.ToList();

            if (contents.Count() != parents.Count) throw new InvalidOperationException("The number of contents and parents should be the same.");

            int i = 0;
            foreach (var content in contents)
            {
                shapes.Add(prefixedEditorManager.UpdateEditor(content, parents[i++], updater, groupId));
            }

            return shapes;
        }
    }
}
