using Moov2.Website.Elements.Elements;
using Orchard.Layouts.Framework.Drivers;
using Orchard.Localization;

namespace Moov2.Website.Elements.Drivers {
    public class SectionElementDriver : ElementDriver<Section> {
        #region Constructor

        public SectionElementDriver() {
            T = NullLocalizer.Instance;
        }

        #endregion

        #region DriverOverrides

        protected override EditorResult OnBuildEditor(Section element, ElementEditorContext context) {
            var editor = context.ShapeFactory.EditorTemplate(TemplateName: "Elements.Section", Model: element);

            if (context.Updater != null) {
                context.Updater.TryUpdateModel(element, context.Prefix, null, null);
            }

            return Editor(context, editor);
        }

        #endregion
    }
}