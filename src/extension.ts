import { commands, ExtensionContext, Range, TextEditor, window } from "vscode";

const sort = (editor: TextEditor, selection: Range): void => {
  let lines: string[] = [];
  if (selection.isSingleLine) {
    const text = editor.document.getText(selection).trim();
    lines = text.split(",").map((line) => line.trim());
  } else {
    for (let i = selection.start.line; i <= selection.end.line; i++) {
      const line = editor.document.lineAt(i).text.trim();
      if (line === "") continue;
      lines.push(line);
    }
  }
  lines.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  const replacement = selection.isSingleLine ? lines.join(", ") : lines.join("\n");
  editor.edit((editBuilder) => {
    editBuilder.replace(selection, replacement);
  })
}

const alphabetize = (context: ExtensionContext): void => {
  const disposable = commands.registerCommand("alphabetize", () => {
    const editor = window.activeTextEditor as TextEditor;
    const selection = editor.selection;
    sort(editor, selection);
  });
  context.subscriptions.push(disposable);
}

exports.activate = alphabetize;
