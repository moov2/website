using Orchard.Layouts.Elements;
using Orchard.Localization;

namespace Moov2.Website.Elements.Elements {
    public class Section : Container {
        public override string Category {
            get { return "Containers"; }
        }

        public override LocalizedString DisplayText {
            get { return T("Section"); }
        }

        public override bool HasEditor {
            get { return true; }
        }
    }
}