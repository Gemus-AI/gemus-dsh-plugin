# Gemus — DeepSeek Harness desktop plugin

Connect the [Gemus](https://gemus.ai) design canvas from the official DeepSeek Harness app.
This bundle includes a Host connection owner and an in-app configuration page. It uses DSH's official MCP client; tools keep their `mcp__gemus__*` names.

## Desktop setup (recommended)

Requires the official DSH Desktop **0.2.1-rc.5** and a Gemus account.
[Download the official app](https://github.com/deepseek-ai/deepseek-harness/releases).
The app includes its runtime; no system Node.js, global CLI, or terminal is required.

1. In DSH, open **Plugins → Add plugin** and enter `github:Gemus-AI/gemus-dsh-plugin`.
2. Install and enable Gemus, then open its page in the installed plugins list.
3. Create a Key at [Gemus Connect](https://gemus.ai/connect). Paste it into **Gemus Key**, select **Connect Gemus**, and confirm the displayed account and personal space.
4. In a normal DSH chat, ask: “Use Gemus workflow_list to list workflows in my personal space. Do not create workflows or generate content.”

A successful check confirms identity and observed tool registration at the shown time, not continuous online status. A normal chat call verifies actual use. Connection checks spend no Gemus generation credits; DSH chat may consume model credits. Model credentials and working-directory selection belong to DSH and remain separate.

The connection is saved by DSH's credentials service and restored after reopening. This local storage is not an encrypted keychain and does not protect secrets from other processes running as the same OS user.

## Recovery and upgrade

Use **Check again** after a network failure or exhausted automatic retries. It rebuilds one official MCP instance and checks again. Use **Change Key** for the wrong account or a revoked Key. **Disconnect** clears this plugin's stored Key and prevents legacy environment fallback; it does not revoke a Gemus Key or alter other clients.

From 0.1.3, use the native Plugins page to uninstall and reinstall, then enter your Key again. Keep your models, chats, and other plugins. Unknown user YAML overrides are not automatically removed; a conflicting Gemus MCP row must be resolved through the host's existing management UI. No build scripts or allowBuilds grant are needed.

Windows and macOS require separate end-to-end verification. Other DSH releases are outside this version's declared compatibility.

## Advanced CLI setup

The existing installer requires Node.js and a `dsh` command on PATH:

```sh
npx -y @gemus/mcp-proxy@0.1.16 setup-dsh
```

It configures the **web** CLI profile, not Desktop. Alternatively:

```sh
dsh plugin --profile web add github:Gemus-AI/gemus-dsh-plugin
export GEMUS_KEY="mak_…"
dsh --profile web
```

In PowerShell use `$env:GEMUS_KEY = "mak_…"` before launching `dsh --profile web` in that same terminal. Child processes inherit the current shell environment. Updating the Windows user environment or a shell startup file requires a new terminal.

Legacy `GEMUS_KEY` / `GEMUS_URL` are read together only when no desktop credential record exists. `GEMUS_URL` is the full MCP URL; the default is `https://gemus.ai/api/mcp`. Advanced self-hosted endpoints allow HTTPS, or HTTP on loopback only, without URL credentials/query/fragment.

Use `dsh --profile web --dump-config` to inspect the Gemus layer. For reproducibility, pin `github:Gemus-AI/gemus-dsh-plugin#<published-sha>`.

## What the agent gets

| Tool | Purpose |
| --- | --- |
| `edit` | Plan operations, multi-node graphs, focused edits and capability-backed imports |
| `read` | Canvas, node/model contract, assets, figures, history and PPT read targets |
| `execute` | Run one or several nodes, then deliver content, renew leases or report client failures |
| `view_image` | View produced images as pixels |
| `workflow_list`, `open_canvas` | Resolve and open an existing workflow |
| `search`, `fetch` | Discover and read community work |
| `ppt_edit`, `publish_workflow` | Deck authoring and confirmed publishing |

Writes require an explicit idempotencyKey. Use the same key only for an identical retry. Read item status and resource identities; execute.wait reports current progress. ask_user_question is available only in Bridge mode.

## Known limits

- **`view_image` depends on your model route, not on dsh.** dsh admits MCP image blocks only after
  the active model positively declares image input. The default route (`deepseek-official` /
  `deepseek-v4-flash`) declares text only, so every image degrades to
  `[image unavailable: …; model "…" does not declare image input; …]` — the model is told it cannot
  see, rather than shown a blank. Route the agent to a model that declares image input and
  `view_image` works as it does on any other host; the attachment store it needs is already mounted
  in this profile.
- **Prefer letting the canvas do the looking.** Independent of the model route, `execute` an
  `analyzer` node with the image wired to its `reference` port and read back the structured text
  report. If that node's model already accepts images (Gemini, Claude, Kimi, GPT, Grok) it sees them
  directly; otherwise the platform routes that run to its own vision provider. Either way the visual
  judgement is made by a vision model on the canvas, not by the agent's model, and it costs no image
  tokens in this session.
- **Audio and embedded resources are never visible.** dsh has no admission path for those blocks;
  they are always replaced by a placeholder. Use `open_canvas` to hand the result to a browser.
- **Generations are billed and slow.** A call blocks until the job finishes. `toolCallTimeoutMs` is
  raised to 600000 (10 min) by this bundle; the server-side ceiling is 45 min. If a call does time
  out, the job usually still completes — re-read the canvas with `read` rather than
  re-running, which would spend credits twice.
- **One key, one account.** All work runs as the owner of the `mak_` key.

## Uninstall

In Desktop, first **Disconnect** on the Gemus plugin page to clear this plugin's stored Key, then use **Uninstall** in Plugins. This does not revoke the Key or change other clients.

For the CLI web profile only:

```sh
dsh plugin --profile web remove gemus-dsh-plugin
```

If you used the one-command installer, also drop the saved key: delete the
`# >>> gemus >>>` … `# <<< gemus <<<` block from your shell startup file (macOS / Linux), or clear
`GEMUS_KEY` from your Windows user environment.

---

Generated from the Gemus monorepo (`.dsh-plugin/`, `scripts/pack-dsh-plugin.mjs`) — edit upstream,
not here. Third-party names are used for interoperability only.

Codex-generated images without a corresponding node remain on the local machine and do not land on the canvas.
New workflows use `workflow_create({workspaceTarget:"personal"|"active",name,idempotencyKey})`; retain the returned `workflowId`, then use `edit`.
