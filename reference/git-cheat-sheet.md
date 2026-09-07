# Git Cheat Sheet

A working reference. Organized by task, not by command name.

---

## Setup

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global pull.rebase true        # rebase instead of merge on pull
git config --global core.editor "vim"

git config --list                            # show all effective config
git config --list --show-origin              # ...and which file each came from
```

Per-repo config drops the `--global` flag and writes to `.git/config`.

### Signing commits

```bash
git config --global user.signingkey <keyid>
git config --global commit.gpgsign true
git config --global gpg.format ssh          # sign with an SSH key instead of GPG
git config --global user.signingkey ~/.ssh/id_ed25519.pub
```

---

## Starting a repo

```bash
git init                                     # new repo in current directory
git init --bare                              # server-side repo (no working tree)
git clone <url>
git clone <url> <dir>
git clone --depth 1 <url>                    # shallow, latest commit only
```

---

## The daily loop

```bash
git status
git status -sb                               # short format + branch line
git add <file>
git add -A                                   # all changes including deletions
git add -p                                   # interactively stage hunks
git commit -m "message"
git commit -am "message"                     # stage tracked files + commit
git commit --amend                           # rewrite the last commit
git commit --amend --no-edit                 # ...keeping the same message
```

**`git add -p` is the underused one.** It walks you through each hunk so a single
commit stays about one thing.

---

## Seeing what changed

| Command | Shows |
|---|---|
| `git diff` | working tree vs. staged |
| `git diff --staged` | staged vs. last commit |
| `git diff HEAD` | working tree vs. last commit |
| `git diff main..feature` | difference between two branches |
| `git diff --stat` | summary of files and line counts only |
| `git diff --word-diff` | word-level rather than line-level |
| `git show <commit>` | full patch for one commit |
| `git show <commit>:<path>` | a file as it existed at that commit |

---

## History

```bash
git log --oneline --graph --decorate --all   # the one worth aliasing
git log -n 10
git log --stat                               # files changed per commit
git log -p <file>                            # patch history of one file
git log --follow <file>                      # ...across renames
git log --since="2 weeks ago"
git log --author="name"
git log -S "some_string"                     # commits that add/remove that string
git log --grep="fix"                         # search commit messages

git blame <file>
git blame -L 40,60 <file>                    # limit to a line range
git shortlog -sn                             # commit counts by author
```

`git log -S` (the "pickaxe") is how you find when a line of config actually
entered the tree.

---

## Branching

```bash
git branch                                   # list local
git branch -a                                # include remote-tracking
git branch -vv                               # show upstream + last commit
git switch <branch>                          # check out existing branch
git switch -c <branch>                       # create and switch
git switch -                                 # back to previous branch
git branch -d <branch>                       # delete (safe, refuses if unmerged)
git branch -D <branch>                       # delete (force)
git branch -m <old> <new>                    # rename
```

`git switch` and `git restore` are the modern split of the old overloaded
`git checkout`. `checkout` still works everywhere.

---

## Merging and rebasing

```bash
git merge <branch>
git merge --no-ff <branch>                   # always create a merge commit
git merge --abort                            # bail out mid-conflict

git rebase <branch>                          # replay your commits on top of theirs
git rebase -i HEAD~5                         # interactive: squash, reword, reorder, drop
git rebase --continue
git rebase --skip
git rebase --abort
```

**Rule of thumb:** rebase your own unpushed work to keep history linear; merge
anything already shared. Rebasing published commits rewrites history other
people have.

### Conflict resolution

```bash
git status                                   # lists conflicted files
# edit files, remove <<<<<<< ======= >>>>>>> markers
git add <resolved-file>
git rebase --continue     # or: git merge --continue

git checkout --ours <file>                   # take your version wholesale
git checkout --theirs <file>                 # take theirs
git diff --name-only --diff-filter=U         # list unresolved files
```

---

## Undoing things

This is the section you'll actually come back for.

| Situation | Command |
|---|---|
| Discard unstaged changes to a file | `git restore <file>` |
| Discard **all** unstaged changes | `git restore .` |
| Unstage a file (keep the edits) | `git restore --staged <file>` |
| Undo last commit, keep changes staged | `git reset --soft HEAD~1` |
| Undo last commit, keep changes unstaged | `git reset HEAD~1` |
| Undo last commit, throw changes away | `git reset --hard HEAD~1` |
| Fix the last commit message | `git commit --amend` |
| Revert a commit that's already pushed | `git revert <commit>` |
| Recover a file from an older commit | `git checkout <commit> -- <file>` |
| Remove untracked files | `git clean -fd` (dry run: `git clean -nd`) |

`reset --hard` and `clean -fd` are the two that actually destroy work. Everything
else is recoverable.

**Pushed already?** Use `revert`, not `reset`. `revert` makes a new commit that
undoes the old one, so nobody else's history breaks.

---

## The reflog — your safety net

```bash
git reflog                                   # every position HEAD has held
git reflog show <branch>
git reset --hard HEAD@{3}                    # jump back to a prior state
```

Almost nothing is truly lost for ~90 days. Botched rebase, bad hard reset,
deleted branch — the reflog has the commit hash. Check here before panicking.

```bash
git fsck --lost-found                        # find dangling commits/blobs
```

---

## Stashing

```bash
git stash                                    # shelve tracked changes
git stash -u                                 # include untracked files
git stash push -m "message" <path>           # stash specific paths, named
git stash list
git stash show -p stash@{0}                  # view the diff
git stash pop                                # apply and drop
git stash apply stash@{1}                    # apply and keep
git stash drop stash@{0}
git stash clear
```

---

## Remotes

```bash
git remote -v
git remote add origin <url>
git remote set-url origin <url>              # repoint to a new host
git remote rename origin upstream
git remote remove <name>

git fetch                                    # download, don't merge
git fetch --all --prune                      # ...and drop deleted remote branches
git pull                                     # fetch + merge (or rebase)
git pull --rebase
git push
git push -u origin <branch>                  # push and set upstream tracking
git push --force-with-lease                  # safe force: fails if remote moved
git push origin --delete <branch>
git push --tags
```

**Use `--force-with-lease`, never bare `--force`.** It aborts if someone else
pushed since your last fetch, instead of silently clobbering their work.

### Multiple remotes

```bash
git remote add origin git@host-a:user/repo.git
git remote set-url --add --push origin git@host-a:user/repo.git
git remote set-url --add --push origin git@host-b:user/repo.git
# one push now writes to both
```

---

## Tags

```bash
git tag                                      # list
git tag -a v1.0.0 -m "release notes"         # annotated (preferred)
git tag v1.0.0                               # lightweight
git tag -a v1.0.0 <commit>                   # tag retroactively
git push origin v1.0.0
git push --tags
git tag -d v1.0.0                            # delete local
git push origin --delete v1.0.0              # delete remote
git describe --tags                          # human-readable version of HEAD
```

---

## Finding a bad commit

```bash
git bisect start
git bisect bad                               # current commit is broken
git bisect good <commit>                     # this one worked
# git checks out a midpoint; test it, then:
git bisect good     # or: git bisect bad
# repeat until git names the culprit
git bisect reset

git bisect run ./test.sh                     # fully automated if you have a test
```

Binary search over history. Ten steps covers a thousand commits.

---

## Ignoring files

`.gitignore` in the repo root (or any subdirectory):

```gitignore
*.log
node_modules/
.env
!important.log        # negate a previous pattern
build/**/*.tmp
```

```bash
git check-ignore -v <file>                   # which rule is ignoring this?
git rm --cached <file>                       # stop tracking, keep on disk
git rm -r --cached .                         # re-apply .gitignore to whole repo
```

Global ignores for editor/OS cruft:

```bash
git config --global core.excludesfile ~/.gitignore_global
```

---

## Worktrees

Multiple branches checked out simultaneously, one `.git` directory:

```bash
git worktree add ../repo-hotfix hotfix
git worktree list
git worktree remove ../repo-hotfix
```

Better than stashing when you need to jump to an unrelated branch mid-work.

---

## Submodules

```bash
git submodule add <url> <path>
git clone --recurse-submodules <url>
git submodule update --init --recursive      # after a plain clone
git submodule update --remote                # pull upstream changes
```

---

## Maintenance

```bash
git gc                                       # garbage collect, repack
git count-objects -vH                        # repo size breakdown
git fsck                                     # integrity check
git verify-pack -v .git/objects/pack/*.idx | sort -k3 -n | tail -20   # biggest objects
```

---

## Aliases worth having

```bash
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.st "status -sb"
git config --global alias.last "log -1 HEAD --stat"
git config --global alias.unstage "restore --staged"
git config --global alias.amend "commit --amend --no-edit"
git config --global alias.wip "commit -am 'WIP'"
```

---

## Commit message shape

```
Short summary, imperative mood, ~50 chars

Body wrapped at 72 columns. Explain *why* the change was made and
what the alternative approaches were, not what the diff already shows.

Refs #123
```

The diff answers "what." The message is the only place "why" can live.

---

## Reference notation

| Notation | Means |
|---|---|
| `HEAD` | current commit |
| `HEAD~3` | three commits back (first parent each time) |
| `HEAD^` | first parent |
| `HEAD^2` | second parent (of a merge commit) |
| `HEAD@{2}` | where HEAD was two reflog moves ago |
| `main..feature` | commits in `feature` not in `main` |
| `main...feature` | commits in either but not both |
| `@` | shorthand for `HEAD` |
