import { commands, ExtensionContext, Range, TextEditor, window } from "vscode";

const activate = (context: ExtensionContext) => {
  const disposable = commands.registerCommand("alphabetize.alphabetize", () => {
    const editor = window.activeTextEditor as TextEditor;
    const { selection } = editor;
    const startPoint = selection.start.line;
    const endPoint = selection.end.line;
    let lines: string[] = [];
    let selectionLength: number;
    if (selection.isSingleLine) {
      selectionLength = editor.document.getText(selection).length;
      lines = editor.document.getText(selection).replace(/\s/g, "").split(",");
    } else {
      selectionLength = editor.document.lineAt(endPoint).text.length;
      for (let i = startPoint; i <= endPoint; i++) {
        if (editor.document.lineAt(i).text.trim() == "") continue;
        lines.push(editor.document.lineAt(i).text);
      }
    }
    lines.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    editor.edit((editBuilder) => {
      selection.isSingleLine
        ? editBuilder.replace(selection, lines.join(", "))
        : editBuilder.replace(
          new Range(startPoint, 0, endPoint, selectionLength),
          lines.join("\n")
        );
    });
  });
  context.subscriptions.push(disposable);
};

exports.activate = activate;
