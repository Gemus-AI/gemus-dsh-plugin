var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __knownSymbol = (name, symbol) => (symbol = Symbol[name]) ? symbol : Symbol.for("Symbol." + name);
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __decoratorStart = (base) => [, , , __create(base?.[__knownSymbol("metadata")] ?? null)];
var __decoratorStrings = ["class", "method", "getter", "setter", "accessor", "field", "value", "get", "set"];
var __expectFn = (fn) => fn !== void 0 && typeof fn !== "function" ? __typeError("Function expected") : fn;
var __decoratorContext = (kind, name, done, metadata2, fns) => ({ kind: __decoratorStrings[kind], name, metadata: metadata2, addInitializer: (fn) => done._ ? __typeError("Already initialized") : fns.push(__expectFn(fn || null)) });
var __decoratorMetadata = (array, target) => __defNormalProp(target, __knownSymbol("metadata"), array[3]);
var __runInitializers = (array, flags, self, value) => {
  for (var i = 0, fns = array[flags >> 1], n = fns && fns.length; i < n; i++) flags & 1 ? fns[i].call(self) : value = fns[i].call(self, value);
  return value;
};
var __decorateElement = (array, flags, name, decorators, target, extra) => {
  var fn, it, done, ctx, access, k = flags & 7, s = !!(flags & 8), p = !!(flags & 16);
  var j = k > 3 ? array.length + 1 : k ? s ? 1 : 2 : 0, key = __decoratorStrings[k + 5];
  var initializers = k > 3 && (array[j - 1] = []), extraInitializers = array[j] || (array[j] = []);
  var desc = k && (!p && !s && (target = target.prototype), k < 5 && (k > 3 || !p) && __getOwnPropDesc(k < 4 ? target : { get [name]() {
    return __privateGet(this, extra);
  }, set [name](x) {
    return __privateSet(this, extra, x);
  } }, name));
  k ? p && k < 4 && __name(extra, (k > 2 ? "set " : k > 1 ? "get " : "") + name) : __name(target, name);
  for (var i = decorators.length - 1; i >= 0; i--) {
    ctx = __decoratorContext(k, name, done = {}, array[3], extraInitializers);
    if (k) {
      ctx.static = s, ctx.private = p, access = ctx.access = { has: p ? (x) => __privateIn(target, x) : (x) => name in x };
      if (k ^ 3) access.get = p ? (x) => (k ^ 1 ? __privateGet : __privateMethod)(x, target, k ^ 4 ? extra : desc.get) : (x) => x[name];
      if (k > 2) access.set = p ? (x, y) => __privateSet(x, target, y, k ^ 4 ? extra : desc.set) : (x, y) => x[name] = y;
    }
    it = (0, decorators[i])(k ? k < 4 ? p ? extra : desc[key] : k > 4 ? void 0 : { get: desc.get, set: desc.set } : target, ctx), done._ = 1;
    if (k ^ 4 || it === void 0) __expectFn(it) && (k > 4 ? initializers.unshift(it) : k ? p ? extra = it : desc[key] = it : target = it);
    else if (typeof it !== "object" || it === null) __typeError("Object expected");
    else __expectFn(fn = it.get) && (desc.get = fn), __expectFn(fn = it.set) && (desc.set = fn), __expectFn(fn = it.init) && initializers.unshift(fn);
  }
  return k || __decoratorMetadata(array, target), desc && __defProp(target, name, desc), p ? k ^ 4 ? extra : desc : target;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateIn = (member, obj) => Object(obj) !== obj ? __typeError('Cannot use the "in" operator on this value') : member.has(obj);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method2) => (__accessCheck(obj, member, "access private method"), method2);

// src/skill.ts
import { BUNDLED_SKILL_RANK } from "@deepseek-ai/dsh-skill";

// ../../skills/gemus-getting-started/SKILL.md
var SKILL_default = '---\nname: gemus-getting-started\ndescription: Use when building, editing, running, or opening an AI design workflow on the Gemus canvas through the Gemus MCP connection.\n---\n\n# Working With Gemus\n\nUse the installed MCP tools to operate the user\'s live Gemus canvas. If the host provides `tool_search`, load a missing tool by its exact name. Other hosts expose connected MCP tools directly; use their tool inventory and report a missing connection instead of requiring an unavailable discovery tool.\n\n## Delivery Surface\n\nWhen the requested deliverable is a Gemus workflow, keep planning and implementation on the Gemus MCP surface. MCP mutations are the implementation: use `edit` with `op: "planCreate" / "planUpdate" / "planDecide"` for durable decisions, `op: "graph"` for multi-node phases, and structure operations for focused changes, `execute` for generation, and `publish_workflow` for a confirmed direct publish.\n\nDo not create local implementation plans, specs, apps, or documents as substitutes for those canvas operations. Local filesystem work is limited to reading user-provided files or preparing assets for upload unless the user explicitly asks for a local code or document deliverable.\n\nBrowser control after `open_canvas` is for opening the returned one-time URL and visual inspection only. It does not replace MCP reads, mutations, execution, or publishing.\n\n## Workflow Contract\n\n1. Resolve the connection mode and target before the first mutation. In Bridge mode, the platform session\'s active workflow is authoritative: edit it in place and omit workflowId, or pass that exact ID. The user must open another workflow to change targets. In standalone MCP clients (Codex, DSH, and other harnesses), there is no current-canvas binding. Reuse an explicit workflowId; when the user names an existing workflow, call `workflow_list` with its exact `name`, reuse the ID only when exactly one match is returned, and ask the user to disambiguate zero or multiple matches. If a new canvas is needed, call `workflow_create` with explicit `workspaceTarget` (`personal` or `active`), `name`, and `idempotencyKey`; keep the returned `workflowId` and use `edit` afterward. Edit does not create workflows. Never guess a target.\n2. For a workflow with three or more connected nodes, load `edit` and use `op: "graph"`; use focused structure operations for small changes. Name each new zone for its design purpose. Declare deliverables in the graph or create the plan first; follow returned node and zone IDs.\n3. Call `edit` with one graph per phase. Reuse the same workflowId on later calls. For phase 2+, read actual prior outputs and connect existingNodeId to the new nodes; extend an existing zone with `zone: { id }`.\n4. Give every analyzer, brainstorm, and generated-text node its own dedicated prompt written for that node. Connect research or other generated material to its `reference` port, never its `prompt` port.\n5. Run `execute` as a dry run first and show any platform-credit estimate before requesting confirmation. In Codex, also load `gemus-codex-imagen` for local image generation and canvas backfill. Other hosts use the providers available through `execute`; they do not require the Codex companion skill.\n6. Call `open_canvas` once after obtaining the workflow ID. In Codex, load and follow `browser:control-in-app-browser`, navigating the one-time URL in its selected user-visible browser. Do not use `browser_navigate`, `browser_snapshot`, standalone Playwright MCP, chrome-devtools, or other external/headless browser surfaces in this Codex flow: they can consume the link outside the visible Browser. The Browser skill\'s own runtime is allowed. In DSH and other MCP hosts, use the host\'s available user-visible browser capability. If the host cannot open it, provide `url` and `fallbackEditorUrl` and say that the user must open it; never claim the canvas opened without evidence.\n\nUse `read` with `requests: [{ target: "contract" }]` for node/model discovery and `target: "workspace" / "node"` for current IDs, outputs, ports, and status. Every write requires idempotencyKey (8\u2013128 safe characters): keep it for retries of the same request, use a new key for a changed operation. Read receipts item by item; an accepted execute item is not proof of completion\u2014check its matching wait handle or read the canvas.\n\n### Minimal graph request\n\nReplace the workflow ID with the returned ID. Graph deliverable references are zero-based: `new:0` is the first entry. Use returned node IDs in later calls; discover node/model contracts before filling their config.\n\n```json\n{\n  "workflowId": "workflow-id",\n  "idempotencyKey": "getting-started-graph-01",\n  "requests": [{\n    "op": "graph",\n    "deliverables": [{ "title": "Launch poster", "kind": "image-set" }],\n    "groups": [{\n      "zone": { "name": "Launch poster" },\n      "deliverableIds": ["new:0"],\n      "nodes": [\n        { "bind": "brief", "nodeType": "text-prompt", "config": { "text": "A minimal ceramic studio launch poster" } },\n        { "bind": "poster", "nodeType": "gen-image-generation", "deliverableId": "new:0", "config": { "model": "gemini-2.5-flash-image", "mode": "text-to-image" } }\n      ],\n      "edges": [{ "from": "brief", "fromPort": "text", "to": "poster", "toPort": "prompt" }]\n    }]\n  }]\n}\n```\n\n## Presentation decks\n\nA workflow carries **at most one `gen-ppt` node**. It is the deck\'s identity: its node ID owns the revision, the plan and the slide bindings. Creating a second one abandons that state instead of repairing it.\n\nPick one authoring mode per node and stay in it:\n\n| Mode | When | What runs | What is forbidden |\n| --- | --- | --- | --- |\n| Direct authoring | You are designing and filling the deck (the default when the user asks Codex to make the PPT) | `ppt_edit` init/plan/write/finalize | Never `execute` the `gen-ppt` node \u2014 it overwrites the deck output with model-generated content |\n| Model pipeline | The user explicitly asks for the node\'s own generation model to produce the deck | `execute` on the `gen-ppt` node | Do not also author the same node with `ppt_edit` in the same pass |\n\nModel constraints are scoped to what they name. "Use `gpt-image-2` for all image generation" applies to `gen-image-generation` nodes only; never propagate an image model onto `gen-ppt`, text, or analysis nodes. `edit` returns `completions` when it auto-corrects an incompatible model \u2014 read them and tell the user what changed.\n\nWhen the canvas already holds real design imagery, plan an image-led deck: every page names its visual protagonist and each asset\'s evidence role. Support a technical claim with the technical artefact \u2014 a plan, section, exploded view or detail \u2014 because an aerial or hero render does not stand in for one. Caption each asset with what THAT asset shows, mark annotated assets and give them `contain`, and do not make one image the protagonist of several pages. `read` with `target: "ppt-plan-check"` and the current revision reports all of this deterministically before any slide exists; fix the plan there rather than meeting the same defects as critique findings afterwards.\n\nWhen the user wants Codex to design and fill a presentation directly on the Gemus canvas, use the MCP PPT editor instead of executing the `gen-ppt` node\'s configured generation model:\n\n1. Find the workflow\'s existing `gen-ppt` node with `read` target `workspace` and reuse it. Create one with `edit` op `add` **only when the canvas has none**; when one already exists you may not create a second. Search for `ppt_edit` with `tool_search` if it is not already loaded.\n2. Read the selected `ppt-style` profile to discover its skeleton catalog before outlining or writing slides. Use only a returned `skeletonId`; never guess one. Read the selected style resource, such as `skill://corporate`, for visual guidance.\n3. Every `ppt_edit` write uses `{ idempotencyKey, request: { op, nodeId, ... } }`. Call `ppt_edit` with `request: { op: "init_deck", nodeId, title }` once. Keep the returned revision, starting at `0` for a new deck.\n4. Call `write_slide_html` once per slide and pass the revision returned by the previous write. Omit `slideId` to create a new slide. Pass `slideId` to update an existing slide. Call `get_layout_seed` for the row first and act on its `assetHints` \u2014 natural aspect ratio, image-box aspect ratio, predicted `object-fit:cover` crop, whether the asset is annotated, and the recommended fit. None of that is computable from the canvas or the seed alone.\n5. Read the optional `critique` returned by each persisted `write_slide_html` or `patch_slide`. If `critique.pass` is false and `critique.correctionAllowed` is true, apply exactly one corrective round, routed by `critique.repairClass`: `local-style` \u2192 `patch_slide`; `structural-layout` \u2192 rewrite the slide with `write_slide_html`; `asset-semantic` \u2192 rebind the right evidence (replan first when the plan is what is wrong) and rewrite; `invalid-source` \u2192 swap the unusable asset or drop it to a lesser role. The correction is re-evaluated automatically. If `correctionAllowed` is false, `critique` is absent, or it passes, continue; never poll or retry the evaluator.\n6. For later edits, call `read` with `requests: [{ target: "node", address: "node://<nodeId>" }]` to get `deckSummary`, then `read` target `node` with that address and `slideId` to read the target HTML before patching or rewriting it.\n\nOutline `assets` contains objects with a canvas asset `label` and optional `role` (`hero`, `evidence`, `background`, or `decoration`), never bare strings. For example, with the existing deck node and actual canvas asset label:\n\n```json\n{\n  "workflowId": "workflow-id",\n  "idempotencyKey": "getting-started-outline-01",\n  "request": {\n    "op": "create_outline",\n    "nodeId": "deck-node-id",\n    "rows": [{ "title": "The proposal", "intent": "Introduce the concept", "assets": [{ "label": "Hero render", "role": "hero" }] }]\n  }\n}\n```\n\nFor PPT HTML, use `read` with `slideId` alone: `{ workflowId, requests: [{ target: "node", address: "node://<deckNodeId>", slideId: "<slideId>" }] }`. `includeHtml:true` reads a `gen-webpage` document; it is not a PPT selector and cannot be combined with `slideId` or `sectionId`.\n\n### Recovering the same node\n\nEvery failure below is repaired **on the original nodeId**. Exhaust this table before even considering a new node; a second `gen-ppt` node is not a recovery step.\n\n| Symptom | Recovery |\n| --- | --- |\n| `code: \'PPT_REVISION_CONFLICT\'` | Retry the same call with the returned `currentRevision` |\n| `code: \'PPT_DECK_MALFORMED\'` | `init_deck` with `force: true` on that same node |\n| `init_deck` failed or the node holds model-generated, non-deck output | `read` with `requests: [{ target: "node", address: "node://<nodeId>" }]` for `deckSummary`, then `init_deck` with `force: true` on that same node |\n| Transport/HTTP error with unknown outcome | `read` with `requests: [{ target: "node", address: "node://<nodeId>" }]` to learn the persisted revision, then continue from it |\n\nRoute a failed `critique` by `repairClass` \u2014 what is actually wrong \u2014 not by how cheap the fix looks. The corrective round happens once, so do not spend it on a patch that cannot reach the cause.\n\nDo not call a retired structured slide-rendering action. Direct `ppt_edit` mutations do not use the `execute` dry-run/credit flow; only run the `gen-ppt` node when the user explicitly asks for its model-driven generation pipeline.\n\n## Bridge questions\n\nIn Bridge mode, ask_user_question accepts `{ idempotencyKey, request: { kind: "question", questions: [...] } }`. Ask all independent questions together (1\u20138), with optional context, image options and multiSelect. Answers return in the same call as ordered strings or arrays. Respect decline/cancel. Retrying a finalized key replays the answer; after a disconnection an unfinished question may be asked again. Other connection modes do not expose this tool.\n\n## Domain skills\n\nBefore planning or creating a domain-specific workflow, check whether a matching Gemus Skill exists; if it does and would improve output quality, read it first with `ReadMcpResourceTool({ uri: "skill://..." })`. **Skip it for simple tasks, or when you already have sufficient context.** Reading a skill is an optional quality boost, not a gate \u2014 never block or stall on it.\n\n| Trigger | Skill |\n| --- | --- |\n| video, animation, storyboard, film | `skill://film-production` |\n| interior, room, space | `skill://interior-design` |\n| brand, logo, visual identity | `skill://brand-visual` |\n| product, packaging, industrial | `skill://product-design` |\n\n`ListMcpResourcesTool()` lists everything available, including `knowledge://model-guide` (model selection) and `knowledge://design-principles` (visual consistency across multiple assets).\n\nCodex-generated images without a corresponding node remain on the local machine and do not land on the canvas.\n';

// src/skill.ts
var frontmatter = /^---\r?\nname: ([^\r\n]+)\r?\ndescription: ([^\r\n]+)\r?\n---\r?\n/;
var metadata = SKILL_default.match(frontmatter);
if (!metadata) throw new Error("Gemus canonical skill metadata is missing");
var candidate = {
  name: metadata[1],
  description: metadata[2],
  provider: "gemus",
  source: "bundled",
  invocation: { modelInvocable: true, userInvocable: true },
  rank: BUNDLED_SKILL_RANK,
  locator: "gemus-getting-started"
};
var provider = {
  name: candidate.provider,
  list: async () => [candidate],
  get: async () => ({ ...candidate, content: SKILL_default.replace(frontmatter, "").trim() })
};
function installGemusSkill(ctx) {
  ctx.skills.registerProvider(() => provider);
}

// src/recovery.ts
import { expandAssistantStream } from "@deepseek-ai/dsh-llm";
import { randomUUID } from "node:crypto";
import { z } from "zod";
var POLICY = "gemus/tool-json/v1";
var MAX_RETRIES = 2;
var stateSchema = z.object({
  turn: z.number().int().nonnegative(),
  step: z.number().int().nonnegative(),
  provider: z.string(),
  requestSeq: z.number().int().nullable(),
  attemptRequestSeq: z.number().int().nullable(),
  attemptSeq: z.number().int().nullable(),
  handledSeq: z.number().int().nullable(),
  names: z.array(z.string()),
  eligible: z.boolean(),
  retries: z.number().int().nonnegative(),
  retryId: z.string().nullable()
});
function empty() {
  return { turn: 0, step: 0, provider: "", requestSeq: null, attemptRequestSeq: null, attemptSeq: null, handledSeq: null, names: [], eligible: false, retries: 0, retryId: null };
}
function inspect(stream) {
  try {
    const chunks = expandAssistantStream(stream).map((value) => value.chunk);
    const last = chunks.at(-1);
    if (last?.type !== "finish" || last.reason.kind !== "error" || last.reason.failure.code !== "MALFORMED_RESPONSE") return { eligible: false, names: [] };
    const starts = chunks.flatMap((chunk) => chunk.type === "block-start" && chunk.blockType === "tool-call" ? [chunk.index] : []);
    const tools = chunks.flatMap((chunk) => chunk.type === "block-end" && chunk.block.type === "tool-call" ? [{ index: chunk.index, block: chunk.block }] : []);
    const names = tools.map((tool) => tool.block.name);
    let malformed = false;
    for (const { block } of tools) {
      try {
        JSON.parse(block.arguments);
      } catch {
        malformed = true;
      }
    }
    return { names, eligible: malformed && tools.length > 0 && starts.length === tools.length && starts.every((start) => tools.some((tool) => tool.index === start)) && names.every((name) => name.startsWith("mcp__gemus__")) };
  } catch {
    return { eligible: false, names: [] };
  }
}
var recoveryProjection = {
  key: "gemusToolJsonRecovery",
  stateVersion: 1,
  stateSchema,
  init: empty,
  apply(state, event) {
    if (event.type === "request/header") return { ...state, provider: event.data.header.config.provider, requestSeq: event.seq };
    if (event.type === "request/context") return { ...state, provider: event.data.provider, requestSeq: event.seq };
    if (event.type === "step/start") return { ...empty(), turn: event.data.turn, step: event.data.step, provider: state.provider, requestSeq: state.requestSeq };
    if (event.type === "turn/end") return { ...empty(), provider: state.provider, requestSeq: state.requestSeq };
    if (event.type === "assistant/attempt") {
      if (event.data.turn !== state.turn || event.data.step !== state.step || state.attemptSeq !== null && event.seq <= state.attemptSeq) return state;
      return { ...state, ...inspect(event.data.stream), attemptSeq: event.seq, attemptRequestSeq: state.requestSeq };
    }
    if (event.type === "llm/retry" && event.data.policyKey === POLICY && event.data.turn === state.turn && event.data.step === state.step && event.data.provider === state.provider && state.attemptSeq !== null && event.seq > state.attemptSeq && state.handledSeq !== state.attemptSeq && event.data.retry === state.retries + 1 && event.data.retry <= MAX_RETRIES && (state.retryId === null || state.retryId === event.data.retryId)) {
      return { ...state, handledSeq: state.attemptSeq, retries: state.retries + 1, retryId: event.data.retryId };
    }
    return state;
  }
};
function installGemusRecovery(ctx, connectionToken) {
  ctx.sessionProjections.register(recoveryProjection);
  let active = true;
  ctx.effect(() => () => {
    active = false;
  });
  ctx.on("agent/request-error", async (payload, next) => {
    const { agent, turn, step, provider: provider2, failure, retryPolicy, signal } = payload;
    if (!active || signal.aborted) return;
    if (failure.code !== "MALFORMED_RESPONSE" || retryPolicy?.mode === "always" || retryPolicy?.mode === "normal" && (retryPolicy.maxRetries === 0 || retryPolicy.retryableCodes.includes(failure.code))) return next();
    const token = connectionToken();
    const before = ctx.sessionProjections.stateOf(agent.session, recoveryProjection.key);
    if (token === void 0 || !before?.eligible || before.turn !== turn || before.step !== step || before.provider !== provider2 || before.requestSeq === null || before.requestSeq !== before.attemptRequestSeq || before.handledSeq === before.attemptSeq || before.retries >= MAX_RETRIES || !before.names.every((name) => ctx.tools.get(name))) return next();
    const downstream = await next();
    if (signal.aborted) return;
    if (downstream?.kind === "retry") return downstream;
    if (!active || connectionToken() !== token) return downstream;
    const current = ctx.sessionProjections.stateOf(agent.session, recoveryProjection.key);
    if (!current || current.attemptSeq !== before.attemptSeq || current.requestSeq !== before.requestSeq || current.handledSeq === current.attemptSeq || current.retries >= MAX_RETRIES) return downstream;
    const retryId = current.retryId ?? randomUUID();
    const retry = current.retries + 1;
    agent.session.append("llm/retry", {
      retryId,
      turn,
      step,
      provider: provider2,
      mode: "normal",
      policyKey: POLICY,
      retry,
      maxRetries: MAX_RETRIES,
      delayMs: 0,
      failure
    });
    if (!active || signal.aborted || connectionToken() !== token) return;
    agent.session.append("llm/retry-started", { retryId, turn, step, retry });
    return { kind: "retry" };
  });
}

// src/host.ts
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";

// src/credentials.ts
import { randomUUID as randomUUID2 } from "node:crypto";
import { credentialKey } from "@deepseek-ai/dsh-credentials";

// src/contracts.ts
var DEFAULT_ENDPOINT = "https://gemus.ai/api/mcp";

// ../codex-backfill-core/src/mcpIdentity.ts
function getMcpKeyIssuer(token) {
  const tagged = /^mak_(cn|global)_[0-9a-f]{48}$/.exec(token);
  if (tagged?.[0] === token) return tagged[1];
  return token.length === 52 && /^mak_[0-9a-f]{48}$/.test(token) ? "global" : null;
}
function resolveMcpEndpoint(endpoint) {
  const syntax = /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\]|(?:www\.)?gemus\.(?:ai|cn))(?::[0-9]+)?\/api\/mcp$/i.exec(endpoint);
  if (!syntax || syntax[0] !== endpoint) return null;
  try {
    const url = new URL(endpoint);
    if (url.username || url.password || url.search || url.hash || url.pathname !== "/api/mcp") return null;
    const host = url.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") {
      return { endpoint: url.href, issuer: "global" };
    }
    if (url.protocol !== "https:" || url.port) return null;
    if (host === "gemus.cn" || host === "www.gemus.cn") return { endpoint: url.href, issuer: "cn" };
    if (host === "gemus.ai" || host === "www.gemus.ai") return { endpoint: url.href, issuer: "global" };
    return null;
  } catch {
    return null;
  }
}

// src/identity.ts
function validateEndpoint(input) {
  const target = resolveMcpEndpoint(input.trim());
  if (!target) throw new Error("invalid-endpoint");
  return target.endpoint;
}
function validateConnectionTarget(config) {
  const target = resolveMcpEndpoint(config.endpoint.trim());
  if (!target) throw new Error("invalid-endpoint");
  const issuer = getMcpKeyIssuer(config.apiKey ?? "");
  if (!issuer) throw new Error("auth-required");
  if (issuer !== target.issuer) throw new Error("identity-mismatch");
  return target;
}
function isObject(value) {
  return typeof value === "object" && value !== null;
}
function validateIdentity(config, identity2) {
  const target = validateConnectionTarget(config);
  const actual = resolveMcpEndpoint(identity2.endpoint);
  const official = (endpoint) => ["gemus.ai", "www.gemus.ai", "gemus.cn", "www.gemus.cn"].includes(new URL(endpoint).hostname);
  if (identity2.instance !== target.issuer || !actual || actual.issuer !== target.issuer || actual.endpoint !== target.endpoint && !(official(actual.endpoint) && official(target.endpoint)) || config.expectedUserId && config.expectedUserId !== identity2.user.id) throw new Error("identity-mismatch");
}
async function identify(config, signal) {
  const target = validateConnectionTarget(config);
  try {
    const response = await fetch(`${target.endpoint}/connection`, {
      headers: { Authorization: `Bearer ${config.apiKey}` },
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.any([signal, AbortSignal.timeout(1e4)])
    });
    if (response.status === 401) throw new Error("auth-required");
    if (response.status === 404 || response.status === 405) throw new Error("server-incompatible");
    if (!response.ok) throw new Error("network-error");
    const body = await response.json();
    if (!isObject(body) || !isObject(body.user) || typeof body.user.id !== "string" || !body.user.id || typeof body.user.displayName !== "string" || body.user.username !== null && typeof body.user.username !== "string" || body.personalWorkspace !== null && (!isObject(body.personalWorkspace) || typeof body.personalWorkspace.id !== "string" || typeof body.personalWorkspace.name !== "string")) throw new Error("server-incompatible");
    const legacy = /^mak_[0-9a-f]{48}$/.test(config.apiKey ?? "") && ["gemus.ai", "www.gemus.ai"].includes(new URL(target.endpoint).hostname) && body.instance === void 0 && body.endpoint === void 0;
    const identity2 = {
      instance: legacy ? "global" : body.instance,
      endpoint: legacy ? target.endpoint : typeof body.endpoint === "string" ? body.endpoint : "",
      user: { id: body.user.id, username: body.user.username, displayName: body.user.displayName },
      personalWorkspace: body.personalWorkspace === null ? null : { id: body.personalWorkspace.id, name: body.personalWorkspace.name }
    };
    validateIdentity(config, identity2);
    return identity2;
  } catch (error) {
    throw new Error(error instanceof Error && ["auth-required", "server-incompatible", "identity-mismatch"].includes(error.message) ? error.message : "network-error");
  }
}

// src/credentials.ts
var CONNECTION_KEY = credentialKey("gemus-dsh-plugin", "connection");
function decode(record, environment) {
  if (!record) return {
    revision: "none",
    enabled: Boolean(environment.GEMUS_KEY),
    apiKey: environment.GEMUS_KEY,
    endpoint: environment.GEMUS_URL || DEFAULT_ENDPOINT,
    source: environment.GEMUS_KEY ? "environment" : "none"
  };
  if (record.kind !== "api-key") throw new Error("storage-error");
  return {
    revision: record.env?.GEMUS_CONNECTION_REVISION ?? "none",
    expectedUserId: record.env?.GEMUS_EXPECTED_USER_ID,
    enabled: record.env?.GEMUS_CONNECTION_ENABLED === "true",
    apiKey: record.key,
    endpoint: record.env?.GEMUS_ENDPOINT || DEFAULT_ENDPOINT,
    source: "saved"
  };
}
function createCredentials(store, environment = process.env) {
  return {
    read: async () => {
      try {
        return decode(await store.readRecord(CONNECTION_KEY), environment);
      } catch {
        throw new Error("storage-error");
      }
    },
    write: async (next, expectedRevision) => {
      const result = await store.modifyRecord(CONNECTION_KEY, async (current) => {
        if (decode(current, environment).revision !== expectedRevision) throw new Error("conflict");
        return { kind: "api-key", ...next.enabled ? { key: next.apiKey } : {}, env: {
          ...next.expectedUserId ? { GEMUS_EXPECTED_USER_ID: next.expectedUserId } : {},
          GEMUS_ENDPOINT: validateEndpoint(next.endpoint),
          GEMUS_CONNECTION_REVISION: randomUUID2(),
          GEMUS_CONNECTION_ENABLED: String(next.enabled)
        } };
      });
      return decode(result, environment);
    }
  };
}

// src/connection.ts
var ConnectionOwner = class {
  constructor(deps) {
    this.deps = deps;
  }
  queue = Promise.resolve();
  generation = 0;
  abort = new AbortController();
  disposed = false;
  lastWrite;
  child;
  view = {
    status: "disconnected",
    revision: "none",
    operationId: 0,
    endpoint: DEFAULT_ENDPOINT,
    source: "none",
    saved: false,
    identity: null,
    toolCount: 0,
    checkedAt: null,
    identityCheckedAt: null,
    toolsCheckedAt: null,
    error: null
  };
  getStatus() {
    return structuredClone(this.view);
  }
  /** A foreground connection change immediately fences an in-flight recovery. */
  get recoveryToken() {
    return !this.disposed && this.child && this.view.status === "verified" && this.view.operationId === this.generation ? this.generation : void 0;
  }
  start(intent) {
    return this.run(async (check) => {
      if (!intent) return this.restore(check);
      await this.clearChild();
      check();
      const current = await this.deps.read();
      check();
      this.acceptRecord(current);
      this.view.identity = null;
      this.view.identityCheckedAt = null;
      if (intent.version !== "connect-v1" || !intent.apiKey || !intent.endpoint || !intent.expectedUserId || intent.expectedUserId !== intent.expectedUserId.trim() || intent.expectedUserId.length > 128 || /[\x00-\x1f\x7f]/.test(intent.expectedUserId)) throw new Error("identity-mismatch");
      await this.connectRecord(current, { apiKey: intent.apiKey, endpoint: intent.endpoint, expectedUserId: intent.expectedUserId, expectedRevision: current.revision }, check);
    });
  }
  /** Observe after the active operation, so own notifications are cheap and foreign updates cannot be lost. */
  recordUpdated() {
    if (this.disposed) return;
    this.queue = this.queue.then(async () => {
      if (this.disposed) return;
      const generation = this.generation;
      const current = await this.deps.read();
      if (generation !== this.generation) {
        this.recordUpdated();
        return;
      }
      if (!this.disposed && (current.revision !== this.view.revision || current.enabled && !this.child)) void this.start();
    }).catch(() => {
      if (!this.disposed) {
        this.view.status = "storage-error";
        this.view.error = "storage-error";
      }
    });
  }
  connect(input) {
    return this.run(async (check) => {
      const current = await this.deps.read();
      check();
      await this.connectRecord(current, input, check);
    });
  }
  async connectRecord(current, input, check) {
    this.expectRevision(current, input.expectedRevision);
    const endpoint = validateEndpoint(input.endpoint);
    const candidate2 = { ...current, endpoint, apiKey: input.apiKey.trim(), enabled: true, expectedUserId: input.expectedUserId?.trim() || void 0 };
    validateConnectionTarget(candidate2);
    const identity2 = await this.deps.identify(candidate2, this.abort.signal);
    check();
    validateIdentity(candidate2, identity2);
    candidate2.expectedUserId = identity2.user.id;
    candidate2.endpoint = identity2.endpoint;
    const identityCheckedAt = (/* @__PURE__ */ new Date()).toISOString();
    const saved = await this.write(candidate2, input.expectedRevision);
    check();
    await this.clearChild();
    check();
    this.acceptRecord(saved);
    this.view.identity = identity2;
    this.view.identityCheckedAt = identityCheckedAt;
    if (!await this.replace(saved, check)) return;
    this.finishCheck();
  }
  recheck(_expectedRevision) {
    return this.run(async (check) => this.restore(check));
  }
  disconnect(expectedRevision) {
    return this.run(async (check) => {
      const current = await this.deps.read();
      check();
      const expected = this.lastWrite?.superseded && this.lastWrite.before === expectedRevision && this.lastWrite.after === current.revision ? current.revision : expectedRevision;
      this.expectRevision(current, expected);
      const disabled = { ...current, enabled: false };
      delete disabled.apiKey;
      const saved = await this.write(disabled, expected);
      check();
      this.acceptRecord(saved);
      await this.clearChild();
      check();
      this.view = { ...this.view, status: "disconnected", identity: null, toolCount: 0, error: null, checkedAt: null, identityCheckedAt: null, toolsCheckedAt: null };
    });
  }
  async dispose() {
    this.disposed = true;
    this.generation++;
    this.abort.abort();
    await this.queue;
    await this.clearChild();
  }
  async restore(check) {
    await this.clearChild();
    check();
    const current = await this.deps.read();
    check();
    this.acceptRecord(current);
    this.view.identity = null;
    this.view.identityCheckedAt = null;
    if (!current.enabled || !current.apiKey) {
      await this.clearChild();
      check();
      this.view.status = "disconnected";
      return;
    }
    validateConnectionTarget(current);
    const identity2 = await this.deps.identify(current, this.abort.signal);
    check();
    validateIdentity(current, identity2);
    this.view.identity = identity2;
    this.view.identityCheckedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (!await this.replace(current, check)) return;
    this.finishCheck();
  }
  async replace(config, check) {
    await this.clearChild();
    check();
    const latest = await this.deps.read();
    check();
    this.expectRevision(latest, config.revision);
    if (!latest.enabled || !latest.apiKey) throw new Error("cancelled");
    this.child = this.deps.mount(latest);
    await this.child.ready;
    check();
    const afterReady = await this.deps.read();
    check();
    if (afterReady.revision !== latest.revision) {
      await this.clearChild();
      check();
      this.acceptRecord(afterReady);
      this.view.identity = null;
      this.view.identityCheckedAt = null;
      this.view.status = afterReady.enabled ? "needs-check" : "disconnected";
      this.view.error = afterReady.enabled ? "conflict" : null;
      return false;
    }
    return true;
  }
  finishCheck() {
    const names = this.child?.tools() ?? [];
    this.view.toolCount = names.length;
    this.view.toolsCheckedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.view.checkedAt = this.view.toolsCheckedAt;
    this.view.status = this.view.identity && names.includes("mcp__gemus__workflow_list") ? "verified" : "needs-check";
    this.view.error = null;
  }
  acceptRecord(record) {
    this.view = { ...this.view, revision: record.revision, endpoint: record.endpoint, source: record.source, saved: record.source === "saved" && record.enabled && Boolean(record.apiKey), toolCount: 0, checkedAt: null, toolsCheckedAt: null };
  }
  expectRevision(record, expected) {
    if (record.revision !== expected) throw new Error("conflict");
  }
  async write(next, expected) {
    const generation = this.generation;
    try {
      const saved = await this.deps.write(next, expected);
      this.lastWrite = { before: expected, after: saved.revision, superseded: generation !== this.generation };
      return saved;
    } catch (error) {
      throw new Error(error instanceof Error && error.message === "conflict" ? "conflict" : "storage-error");
    }
  }
  async clearChild() {
    const child = this.child;
    if (child) {
      await child.dispose();
      this.child = void 0;
    }
  }
  run(operation) {
    const generation = ++this.generation;
    this.abort.abort();
    this.abort = new AbortController();
    const check = () => {
      if (this.disposed || generation !== this.generation) throw new Error("cancelled");
    };
    const task = this.queue.then(async () => {
      const previousStatus = this.view.status === "checking" ? "needs-check" : this.view.status;
      try {
        check();
        this.view = { ...this.view, status: "checking", operationId: generation, error: null };
        await operation(check);
      } catch (error) {
        if (this.disposed || generation !== this.generation) return this.getStatus();
        const safe = error instanceof Error && ["auth-required", "network-error", "server-incompatible", "storage-error", "conflict", "invalid-endpoint", "host-incompatible", "cancelled", "identity-mismatch"].includes(error.message) ? error.message : "host-incompatible";
        this.view.error = safe;
        this.view.status = this.child && this.view.identity ? previousStatus : safe === "auth-required" || safe === "network-error" || safe === "server-incompatible" || safe === "storage-error" ? safe : "needs-check";
      }
      return this.getStatus();
    });
    this.queue = task.catch(() => void 0);
    return task;
  }
};

// src/mcp.ts
import * as mcpClient from "@deepseek-ai/dsh-mcp-client";
function mountOfficialClient(ctx, config) {
  const child = ctx.plugin(mcpClient, {
    transport: "streamable-http",
    serverName: "gemus",
    url: config.endpoint,
    headers: { Authorization: `Bearer ${config.apiKey}` },
    toolCallTimeoutMs: 6e5,
    failOnStartupError: false
  });
  return {
    ready: child,
    tools: () => ctx.tools.schemas().map((tool) => tool.name).filter((name) => name.startsWith("mcp__gemus__")),
    dispose: () => child.dispose()
  };
}

// src/remote.ts
import { z as z2 } from "zod";
import { createTypertRemoteInfo } from "@deepseek-ai/dsh-typert-protocol/remote-info";
var identity = z2.object({ instance: z2.enum(["cn", "global"]), endpoint: z2.string(), user: z2.object({ id: z2.string(), username: z2.string().nullable(), displayName: z2.string() }), personalWorkspace: z2.object({ id: z2.string(), name: z2.string() }).nullable() });
var view = z2.object({
  status: z2.enum(["disconnected", "checking", "verified", "needs-check", "auth-required", "network-error", "server-incompatible", "host-incompatible", "storage-error"]),
  revision: z2.string(),
  operationId: z2.number(),
  endpoint: z2.string(),
  source: z2.enum(["none", "saved", "environment"]),
  saved: z2.boolean(),
  identity: identity.nullable(),
  toolCount: z2.number(),
  checkedAt: z2.string().nullable(),
  identityCheckedAt: z2.string().nullable(),
  toolsCheckedAt: z2.string().nullable(),
  error: z2.enum(["auth-required", "network-error", "server-incompatible", "storage-error", "conflict", "invalid-endpoint", "host-incompatible", "cancelled", "identity-mismatch"]).nullable()
});
function codec(schema, name) {
  return { mode: "strict", typeSymbol: `gemus/${name}`, create: () => schema };
}
function method(name, schema) {
  return {
    service: "gemusConnection",
    invocation: { kind: "direct" },
    parameters: name && schema ? [{ name, source: "json", codec: codec(schema, name), strictCodec: codec(schema, name) }] : [],
    result: codec(view, "ConnectionView")
  };
}
var GEMUS_REMOTE = createTypertRemoteInfo({ package: "gemus-dsh-plugin", methods: {
  "gemusConnection/getStatus": method(),
  "gemusConnection/connect": method("input", z2.strictObject({ apiKey: z2.string().max(512), endpoint: z2.string().max(2048), expectedRevision: z2.string().max(128), expectedUserId: z2.string().max(128).optional() })),
  "gemusConnection/recheck": method("expectedRevision", z2.string().max(128)),
  "gemusConnection/disconnect": method("expectedRevision", z2.string().max(128))
} }, z2);

// src/host.ts
var _disconnect_dec, _recheck_dec, _connect_dec, _getStatus_dec, _a, _init;
var GemusConnection = class extends (_a = TypertRemoteService, _getStatus_dec = [Remote], _connect_dec = [Remote], _recheck_dec = [Remote], _disconnect_dec = [Remote], _a) {
  constructor(ctx) {
    super(ctx, "gemusConnection");
    __runInitializers(_init, 5, this);
    __publicField(this, "owner");
    __publicField(this, "initialized");
    this.owner = new ConnectionOwner({ ...createCredentials(ctx.credentials), identify, mount: (config) => mountOfficialClient(ctx, config) });
    ctx.inject(["skills"], installGemusSkill);
    ctx.inject(["sessionProjections", "tools"], (recoveryCtx) => installGemusRecovery(recoveryCtx, () => this.owner.recoveryToken));
    ctx.effect(() => ctx.typert.remotes.register(GEMUS_REMOTE));
    ctx.on("credentials/record-updated", (key) => {
      if (key === CONNECTION_KEY) this.owner.recordUpdated();
    });
    const environment = process.env;
    const intent = environment.GEMUS_SETUP_INTENT !== void 0 || environment.GEMUS_SETUP_EXPECTED_USER_ID !== void 0 ? { version: environment.GEMUS_SETUP_INTENT, apiKey: environment.GEMUS_KEY, endpoint: environment.GEMUS_URL, expectedUserId: environment.GEMUS_SETUP_EXPECTED_USER_ID } : void 0;
    delete environment.GEMUS_SETUP_INTENT;
    delete environment.GEMUS_SETUP_EXPECTED_USER_ID;
    this.initialized = this.owner.start(intent);
    ctx.effect(() => () => this.owner.dispose());
  }
  assertOwner() {
    if (this.ctx.invocation?.peer.principal.kind !== "owner") throw new Error("Gemus configuration requires the Host owner");
  }
  async getStatus() {
    this.assertOwner();
    await this.initialized;
    return this.owner.getStatus();
  }
  async connect(input) {
    this.assertOwner();
    return this.owner.connect(input);
  }
  async recheck(expectedRevision) {
    this.assertOwner();
    return this.owner.recheck(expectedRevision);
  }
  async disconnect(expectedRevision) {
    this.assertOwner();
    return this.owner.disconnect(expectedRevision);
  }
};
_init = __decoratorStart(_a);
__decorateElement(_init, 1, "getStatus", _getStatus_dec, GemusConnection);
__decorateElement(_init, 1, "connect", _connect_dec, GemusConnection);
__decorateElement(_init, 1, "recheck", _recheck_dec, GemusConnection);
__decorateElement(_init, 1, "disconnect", _disconnect_dec, GemusConnection);
__decoratorMetadata(_init, GemusConnection);
__publicField(GemusConnection, "inject", ["credentials", "tools", "typert", "systemPrompt"]);
export {
  GemusConnection as default
};
