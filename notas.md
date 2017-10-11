
## [Displaying Lint Output in the Editor](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#displaying-lint-output-in-the-editor)

npm init
npm install --save-dev eslint-config-react-app

project/.eslintrc:

{
    "extends": "react-app"
}

## Visual Studio Code: open file

project/.vscode/tasks.json:

{
    "version": "0.1.0",
    "command": "open",
    "args": ["${file}"],
}