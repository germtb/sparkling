# Sparkling

Sparkling is a general fuzzy finder. It is different from the atom built-in one in that I tried to build it totally customisable. It's responsability is to filter data, not to provide it.

## Install

Download this package from the atom package list. This package relies heavily on other programs from which it can create data sources. I recommend installing ag and ripgrep and including it in your path:

https://github.com/BurntSushi/ripgrep

https://github.com/ggreer/the_silver_searcher

## Key features

* Super fast fuzzy file selection via ripgrep
* Multiline regex search via the silver searcher
* Insert emoji
* Autocomplete lines
* Common file operations: copy, move, delete
* Common git operations: checkout branch, checked -- file, stage file, checkout commit, copy commit hash...
* Folder navigation via ls
* Replace (work in progress)

## Keybindings

This package comes with a lot of Keybindings. I have tried my best to accomodate them semantically without disturbing native atom Keybindings. However, if this does not suit you, you can disable them in the package settings and create your own. Also, the table below is valid for windows/linux by using ctrl instead of cmd.

| Command                            | Keybinding              | Data source                | On activate          |
| ---------------------------------- | ----------------------- | -------------------------- | -------------------- |
| sparkling:files                    | cmd-p cmd-p             | ripgrep project files      | Go to                |
| sparkling:commands                 | cmd-shift-p             | Commands on active element | Run command          |
| sparkling:relativePathInsert       | cmd-p cmd-r             | ripgrep project files      | Insert relative path |
| sparkling:relativePathCopy         | cmd-p cmd-R             | ripgrep project files      | Copy relative path   |
| sparkling:emoji                    | cmd-e cmd-a             | emoji                      | Insert               |
| sparkling:gitFiles                 | cmd-g cmd-f             | git status                 | Go to                |
| sparkling:gitStage                 | cmd-g cmd-s             | git status                 | Stage / unstage      |
| sparkling:gitCheckout              | cmd-g cmd--             | git status                 | Checkout --          |
| sparkling:gitBranches              | cmd-g cmd-b             | git branches               | Checkout             |
| sparkling:gitLog                   | cmd-g cmd-l             | git log                    | Copy git hash        |
| sparkling:gitLogCheckout           | cmd-g cmd-L             | git log                    | Checkout             |
| sparkling:gitReflog                | cmd-g cmd-r             | git reflog                 | Copy git hash        |
| sparkling:gitReflogCheckout        | cmd-g cmd-R             | git reflog                 | Checkout             |
| sparkling:allLines                 | cmd-l cmd-L             | ripgrep project lines      | Go to                |
| sparkling:ls                       | cmd-l cmd-s             | ls                         | Go to / dive         |
| sparkling:removeFiles              | cmd-p cmd-D             | ripgrep project files      | rm                   |
| sparkling:copyFiles                | cmd-p cmd-c             | ripgrep project files      | cp                   |
| sparkling:moveFiles                | cmd-p cmd-m             | ripgrep project files      | mv                   |
| sparkling:findToggle               | cmd-p cmd-f enter       | ag pattern in project      | Go to                |
| sparkling:findInBufferToggle       | cmd-b cmd-f enter       | ag pattern in buffer       | Go to                |
| sparkling:findToggle (WIP)         | cmd-p cmd-f shift-enter | ag pattern in project      | Replace              |
| sparkling:findInBufferToggle (WIP) | cmd-b cmd-f shift-enter | ag pattern in buffer       | Replace              |

| Utils / Navigation       | Keybinding | Effect                                |
| ------------------------ | ---------- | ------------------------------------- |
| sparkling:previous       | ctrl-k     | Go up                                 |
| sparkling:right          | ctrl-l     | Go right                              |
| sparkling:left           | ctrl-h     | Go left                               |
| sparkling:next           | ctrl-j     | Go down                               |
| sparkling:previous       | up         | Go up                                 |
| sparkling:next           | down       | Go down                               |
| sparkling:hide           | escape     | Close                                 |
| sparkling:hide           | cmd-escape | Close                                 |
| sparkling:accept         | enter      | Activate                              |
| sparkling:toggleSelfFind | cmd-f      | toggles path of file in active editor |

## Find files

![](https://raw.githubusercontent.com/germtb/gifs/master/findFiles.gif)

## Find pattern

![](https://raw.githubusercontent.com/germtb/gifs/master/find.gif)

## Replace pattern

![](https://raw.githubusercontent.com/germtb/gifs/master/replace.gif)

## Find project lines

![](https://raw.githubusercontent.com/germtb/gifs/master/findProjectLines.gif)

## ls navigation

![](https://raw.githubusercontent.com/germtb/gifs/master/ls.gif)

## Find lines in buffer

![](https://raw.githubusercontent.com/germtb/gifs/master/findLine.gif)

## Autocomplete lines

![](https://raw.githubusercontent.com/germtb/gifs/master/autocompleteLines.gif)

## git status

![](https://raw.githubusercontent.com/germtb/gifs/master/gitFiles.gif)

## git stage

![](https://raw.githubusercontent.com/germtb/gifs/master/gitStage.gif)

## git branches

![](https://raw.githubusercontent.com/germtb/gifs/master/gitBranches.gif)

## Plugin service interface

You can build a plugin with your own sources, just like I show in this example project: https://github.com/germtb/sparkling-extras

I provide a `React` instance a redux `store` so that you can interact with sparkling and even create your own view for it.
