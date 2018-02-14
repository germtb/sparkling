# Sparkling

Sparkling is a general fuzzy finder. It is different from the atom built-in one in that I tried to build it totally customisable. It's responsability is to filter data, not to provide it.

## Default commands

| Keybinding        |        Data source         |           activate |
| ----------------- | :------------------------: | -----------------: |
| `cmd-p`           |  ripgrep files in project  |          open file |
| `cmd-shift-a`     | ripgrep pattern in project | go to line in file |
| `cmd-m`           |         git status         |          open file |
| `cmd-b`           |        git branches        |    checkout branch |
| `cmd-l` + `cmd-l` |    current buffer lines    |         go to line |
| `cmd-l` + `cmd-L` |  ripgrep lines in project  | go to line in file |
| `cmd-l` + `cmd-a` |  ripgrep lines in project  |        insert text |

`cmd-p` defaults to disabled since you need `ripgrep` in your path and I do not want to make it look like the plugin is broken.

## Plugin service interface

You can build a plugin with your own sources, just like I show in this example project: https://github.com/germtb/sparkling-extras

As you can see I provide a `h` instance from preact and a redux `store` so that you can interact with sparkling and even create your own view for it.
