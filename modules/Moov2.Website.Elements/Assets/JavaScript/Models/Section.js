var LayoutEditor;
(function (LayoutEditor) {

    LayoutEditor.Section = function (data, htmlId, htmlClass, htmlStyle, isTemplated, contentType, contentTypeLabel, contentTypeClass, hasEditor, rule, children) {
        LayoutEditor.Element.call(this, "Section", data, htmlId, htmlClass, htmlStyle, isTemplated, rule);
        LayoutEditor.Container.call(this, ["Grid", "Content"], children);

        this.contentType = contentType;
        this.contentTypeLabel = contentTypeLabel;
        this.contentTypeClass = contentTypeClass;
        this.hasEditor = false;

        this.isContainable = true;
        this.dropTargetClass = "layout-common-holder";

        this.toObject = function () {
            var result = this.elementToObject();
            result.children = this.childrenToObject();
            return result;
        };
    };

    LayoutEditor.Section.from = function (value) {
        var result = new LayoutEditor.Section(
            value.data,
            value.htmlId,
            value.htmlClass,
            value.htmlStyle,
            value.isTemplated,
            value.contentType,
            value.contentTypeLabel,
            value.contentTypeClass,
            value.hasEditor,
            value.rule,
            LayoutEditor.childrenFrom(value.children));
        result.toolboxIcon = value.toolboxIcon;
        result.toolboxLabel = value.toolboxLabel;
        result.toolboxDescription = value.toolboxDescription;
        return result;
    };

    LayoutEditor.registerFactory("Section", function (value) {
        return LayoutEditor.Section.from(value);
    });


})(LayoutEditor || (LayoutEditor = {}));