# GLSL

A few helper tools are provided. To run a glsl file with dynamic uniforms, add a run.js file to the directory containing the .glsl file.

This lets you quickly test the shader with specified uniforms.

See `scenes/2d-pong.synscene/run.js` for an example.

To run on cmd+r add the following in vscode:

keybindings.json

```json
{
    "key": "cmd+r",
    "command": "workbench.action.terminal.sendSequence",
    "args": {
        "text": "node ${fileDirname}/run.js\r"
    },
    "when": "editorLangId == glsl"
},
``

settings.json

```json
"files.associations": {
    "*.js": "javascriptreact",
    "*.glsl": "glsl"
},
```
