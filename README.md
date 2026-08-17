# Gemus — DeepSeek Harness bundle

Drive the [Gemus](https://gemus.ai) AI design canvas from DeepSeek Harness: plan a node workflow, run
image / video / 3D / PPT generations on it, and read the produced assets back — as native `dsh` tools.

This bundle is **configuration only**. It ships one `@deepseek-ai/dsh-mcp-client` row pointed at the
hosted Gemus MCP endpoint; there is no plugin code, no build step, and no dependency on the
developer-preview Cordis plugin API.

## Requirements

- DeepSeek Harness (`dsh`) installed.
- A Gemus account and an MCP key (`mak_…`): [gemus.ai](https://gemus.ai) → Settings → MCP Keys.
  Generations spend Gemus credits from that account.

## Install

```sh
npx -y @gemus/mcp-proxy@0.1.15 setup-dsh
```

It asks for your key (masked, never echoed), saves it — the Windows user environment, or a managed
block in your shell startup file on macOS / Linux — installs this bundle, and then starts `dsh` with
the key already in its environment. Rerunning it is safe: the managed block is replaced, not stacked.

Add `--url "https://your-gemus.example/api/mcp"` for a self-hosted or development Gemus.

### Manual install

For shells the installer does not write (fish and friends), or when startup files are off limits:

```sh
dsh plugin --profile web add github:Gemus-AI/gemus-dsh-plugin
```

The bundle has no lifecycle scripts, so pnpm needs no `allowBuilds` grant. Pin a commit
(`github:Gemus-AI/gemus-dsh-plugin#<sha>`) if you want the layer frozen.

Then export your key **before starting `dsh`** — the row reads it from the environment, so the key
never lands in a config file. Note that environment variables only reach *new* processes: starting
`dsh` in the very terminal where you set the key can leave it unset, which looks exactly like the
model having no Gemus tools.

```sh
# macOS / Linux
export GEMUS_KEY="mak_…"
```

```powershell
# Windows PowerShell
$env:GEMUS_KEY = "mak_…"
```

Self-hosted or development Gemus: also set `GEMUS_URL` to the full MCP endpoint
(`https://your-gemus.example/api/mcp`). Unset, it defaults to `https://gemus.ai/api/mcp`.

## Verify

Start `dsh` and confirm the tools registered:

```sh
dsh --profile web --dump-config   # shows a "# == gemus-dsh-plugin" layer
```

In a session, the model should see `mcp__gemus__*`. A good first prompt:

> Use node_list to show me which Gemus generation nodes exist.

Discovery is asynchronous, so the very first turn after a fresh install can start before the tools are
registered — ask again rather than concluding it is broken.

If `mcp__gemus__` tools still do not appear, the connection failed: the client logs the error and
activates with no tools (it does not abort the harness). The usual cause is an unset or expired
`GEMUS_KEY`.

## What the agent gets

| Tool | Purpose |
| --- | --- |
| `project_plan`, `blueprint` | Plan a workflow; creates the canvas when none is given |
| `canvas_edit`, `canvas_read` | Transactional graph edits; authoritative canvas reads |
| `node_list` | Node and model catalog discovery |
| `execute`, `batch_execute` | Run one node, or many in parallel |
| `read_asset`, `view_image` | Fetch produced assets |
| `workflow_list`, `open_canvas` | List workflows; open one in the browser via a one-time deep link |
| `search_community`, `study_community_work`, `import_community_workflow` | Learn from published work |
| `add_references`, `extract_document_figures`, `place_document_figures` | Reference and document material |
| `ppt_edit`, `publish_workflow`, `recall_history` | Deck editing, publishing, session history |

## Known limits

- **Images are not visible to the model.** dsh renders image, audio, and resource blocks as
  placeholders, so `view_image` cannot be used for visual judgement here. Use `open_canvas` to hand
  the result to a browser instead.
- **Generations are billed and slow.** A call blocks until the job finishes. `toolCallTimeoutMs` is
  raised to 600000 (10 min) by this bundle; the server-side ceiling is 45 min. If a call does time
  out, the job usually still completes — re-read the canvas with `canvas_read` rather than
  re-running, which would spend credits twice.
- **One key, one account.** All work runs as the owner of the `mak_` key.

## Uninstall

```sh
dsh plugin --profile web remove gemus-dsh-plugin
```

If you used the one-command installer, also drop the saved key: delete the
`# >>> gemus >>>` … `# <<< gemus <<<` block from your shell startup file (macOS / Linux), or clear
`GEMUS_KEY` from your Windows user environment.

---

Generated from the Gemus monorepo (`.dsh-plugin/`, `scripts/pack-dsh-plugin.mjs`) — edit upstream,
not here. Third-party names are used for interoperability only.
