window.__ModuleLoader__.load({ id: "gemus-dsh-plugin", factory: (require) => { var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.tsx
var client_exports = {};
__export(client_exports, {
  ConnectionPanel: () => ConnectionPanel,
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react = require("react");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");

// src/remote.ts
var import_zod = require("zod");

// ../../node_modules/.pnpm/@deepseek-ai+dsh-typert-protocol@_vgkmyg3mxylp7xxhyjl7pxe7yu/node_modules/@deepseek-ai/dsh-typert-protocol/lib/types/remote-info.js
function createTypertRemoteInfo(spec, zod) {
  return new RemoteInfo(spec, zod);
}
var RemoteInfo = class {
  spec;
  zod;
  index;
  constructor(spec, zod) {
    this.spec = spec;
    this.zod = zod;
  }
  get package() {
    return this.spec.package;
  }
  get descriptors() {
    return this.resolve().descriptors;
  }
  get methods() {
    return this.resolve().methods;
  }
  resolve() {
    if (this.index !== void 0)
      return this.index;
    const zod = this.zod;
    const descriptors = [];
    const methods = /* @__PURE__ */ Object.create(null);
    for (const [endpoint, definition] of Object.entries(this.spec.methods)) {
      const separator = endpoint.indexOf("/");
      const namespace = endpoint.slice(0, separator);
      const method2 = endpoint.slice(separator + 1);
      const parameters = definition.parameters.map((parameter) => ({ ...parameter, wire: parameter.wire ?? parameter.name }));
      const descriptor = {
        ...definition,
        id: `${this.spec.package}#${endpoint}`,
        namespace,
        method: method2,
        parameters,
        result: definition.result.description === void 0 ? definition.result : new ResultValue(definition.result)
      };
      if (definition.invocation.kind === "direct") {
        const inputs = [];
        const direct = Object.assign(descriptor, {
          input(options) {
            const strict = options?.strict === true;
            return inputs[strict ? 1 : 0] ??= new NamedInput(parameters, strict, zod);
          },
          invoke(remote, input, signal) {
            const named = input;
            const values = parameters.map((parameter) => named[parameter.wire]);
            if (definition.cancellation !== void 0)
              values.push(signal);
            const receiver = Reflect.get(remote, namespace);
            const call = Reflect.get(receiver, method2);
            return call.apply(receiver, values);
          }
        });
        methods[endpoint] = direct;
      }
      descriptors.push(descriptor);
    }
    return this.index = { descriptors, methods };
  }
};
function optional(parameter) {
  return parameter.source === "json" && parameter.acceptsUndefined === true;
}
var NamedInput = class {
  parameters;
  strict;
  zod;
  schema;
  projection;
  constructor(parameters, strict, zod) {
    this.parameters = parameters;
    this.strict = strict;
    this.zod = zod;
  }
  codec(parameter) {
    return this.strict ? parameter.strictCodec : parameter.codec;
  }
  create = () => this.schema ??= this.zod.strictObject(Object.fromEntries(this.parameters.map((parameter) => {
    const value = this.codec(parameter).create();
    return [parameter.wire, optional(parameter) ? value.optional() : value.nonoptional()];
  })));
  get jsonSchema() {
    return this.project().jsonSchema;
  }
  get jsonSchemaError() {
    return this.project().jsonSchemaError;
  }
  project() {
    if (this.projection !== void 0)
      return this.projection;
    const unavailable = this.parameters.find((parameter) => this.codec(parameter).jsonSchema === void 0);
    if (unavailable !== void 0) {
      return this.projection = { jsonSchemaError: this.codec(unavailable).jsonSchemaError ?? `No JSON Schema for parameter ${unavailable.wire}` };
    }
    return this.projection = {
      jsonSchema: {
        type: "object",
        properties: Object.fromEntries(this.parameters.map((parameter) => [parameter.wire, {
          ...this.codec(parameter).jsonSchema,
          ...parameter.description === void 0 ? {} : { description: parameter.description }
        }])),
        required: this.parameters.filter((parameter) => !optional(parameter)).map((parameter) => parameter.wire),
        additionalProperties: false
      }
    };
  }
};
var ResultValue = class {
  spec;
  projection;
  constructor(spec) {
    this.spec = spec;
  }
  get mode() {
    return this.spec.mode;
  }
  get typeSymbol() {
    return this.spec.typeSymbol;
  }
  get create() {
    return this.spec.create;
  }
  get decode() {
    return this.spec.decode;
  }
  get encode() {
    return this.spec.encode;
  }
  get description() {
    return this.spec.description;
  }
  get jsonSchemaError() {
    return this.spec.jsonSchemaError;
  }
  get jsonSchema() {
    if (this.projection === void 0) {
      const schema = this.spec.jsonSchema;
      this.projection = { value: schema === void 0 ? void 0 : { ...schema, description: this.spec.description } };
    }
    return this.projection.value;
  }
};

// src/remote.ts
var identity = import_zod.z.object({ user: import_zod.z.object({ id: import_zod.z.string(), username: import_zod.z.string().nullable(), displayName: import_zod.z.string() }), personalWorkspace: import_zod.z.object({ id: import_zod.z.string(), name: import_zod.z.string() }).nullable() });
var view = import_zod.z.object({
  status: import_zod.z.enum(["disconnected", "checking", "verified", "needs-check", "auth-required", "network-error", "server-incompatible", "host-incompatible", "storage-error"]),
  revision: import_zod.z.string(),
  operationId: import_zod.z.number(),
  endpoint: import_zod.z.string(),
  source: import_zod.z.enum(["none", "saved", "environment"]),
  saved: import_zod.z.boolean(),
  identity: identity.nullable(),
  toolCount: import_zod.z.number(),
  checkedAt: import_zod.z.string().nullable(),
  identityCheckedAt: import_zod.z.string().nullable(),
  toolsCheckedAt: import_zod.z.string().nullable(),
  error: import_zod.z.enum(["auth-required", "network-error", "server-incompatible", "storage-error", "conflict", "invalid-endpoint", "host-incompatible", "cancelled"]).nullable()
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
  "gemusConnection/connect": method("input", import_zod.z.strictObject({ apiKey: import_zod.z.string().max(512), endpoint: import_zod.z.string().max(2048), expectedRevision: import_zod.z.string().max(128) })),
  "gemusConnection/recheck": method("expectedRevision", import_zod.z.string().max(128)),
  "gemusConnection/disconnect": method("expectedRevision", import_zod.z.string().max(128))
} }, import_zod.z);

// src/contracts.ts
var DEFAULT_ENDPOINT = "https://gemus.ai/api/mcp";

// src/locales/en.ts
var en = {
  title: "Connect Gemus",
  key: "Gemus Key",
  keyHint: "Create a Gemus Key on the Connect page, then paste it here. It is saved by this DSH installation; your model key is separate.",
  connect: "Connect Gemus",
  replace: "Change Key",
  recheck: "Check again",
  disconnect: "Disconnect",
  advanced: "Advanced: self-hosted Gemus",
  endpoint: "MCP endpoint",
  account: "Gemus account",
  space: "Personal space",
  noSpace: "No personal space yet",
  saved: "Saved in DSH",
  environment: "Using GEMUS_KEY / GEMUS_URL from the environment. Connect to save a desktop credential.",
  tools: "Registered tools",
  lastCheck: "Last check",
  snapshot: "This is a check result, not a live online indicator. Confirm actual use in a DSH chat.",
  prompt: "Use Gemus workflow_list to list workflows in my personal space. Do not create workflows or generate content.",
  copy: "Copy first task",
  copied: "Copied",
  model: "If chat reports no model, sign in or configure a model in DSH. Gemus Key does not configure the model. Normal chat may use model credits.",
  "status.disconnected": "Not connected",
  "status.checking": "Checking\u2026",
  "status.verified": "Account verified and tools registered",
  "status.needs-check": "Not verified. The plugin remains enabled for automatic recovery.",
  "status.auth-required": "Key is invalid or revoked. Enter a new Gemus Key.",
  "status.network-error": "Cannot reach Gemus. Check your network and try again.",
  "status.host-incompatible": "Plugin could not activate. Check your DSH version or conflicting Gemus plugins.",
  "status.storage-error": "Could not save the connection. Your previous credential is unchanged.",
  "error.auth-required": "This Key was not accepted. The previous connection has not been replaced.",
  "error.network-error": "Gemus could not be verified. Check your network and endpoint.",
  "error.storage-error": "Saving failed. The connection has not been saved.",
  "error.conflict": "The connection changed elsewhere. Check again to load the current connection.",
  "status.server-incompatible": "This Gemus service does not support account verification yet.",
  "error.server-incompatible": "Ask the Gemus service administrator to update the service, then check again. Existing registered tools may still work in chat.",
  "error.invalid-endpoint": "Use HTTPS, or HTTP on localhost. Do not include URL credentials, a query, or a fragment.",
  "error.host-incompatible": "Check the DSH version and whether another Gemus plugin owns the tools.",
  "error.cancelled": "The operation was superseded. Check again.",
  loading: "Loading Gemus connection\u2026",
  unavailable: "Cannot read the plugin connection. Reopen this page or check the DSH connection.",
  retry: "Retry"
};

// src/locales/zh.ts
var zh = {
  title: "\u8FDE\u63A5 Gemus",
  key: "Gemus Key",
  keyHint: "\u5728 Gemus \u63A5\u5165\u9875\u521B\u5EFA Key\uFF0C\u518D\u7C98\u8D34\u5230\u8FD9\u91CC\u3002\u7531\u5F53\u524D DSH \u4FDD\u5B58\uFF1B\u6A21\u578B\u51ED\u636E\u9700\u53E6\u884C\u914D\u7F6E\u3002",
  connect: "\u8FDE\u63A5 Gemus",
  replace: "\u66F4\u6362 Key",
  recheck: "\u91CD\u65B0\u68C0\u6D4B",
  disconnect: "\u65AD\u5F00\u8FDE\u63A5",
  advanced: "\u9AD8\u7EA7\uFF1A\u81EA\u6258\u7BA1 Gemus",
  endpoint: "MCP \u670D\u52A1\u5730\u5740",
  account: "Gemus \u8D26\u6237",
  space: "\u4E2A\u4EBA\u7A7A\u95F4",
  noSpace: "\u5C1A\u65E0\u4E2A\u4EBA\u7A7A\u95F4",
  saved: "\u5DF2\u4FDD\u5B58\u5230 DSH",
  environment: "\u5F53\u524D\u4F7F\u7528\u73AF\u5883\u53D8\u91CF GEMUS_KEY / GEMUS_URL\u3002\u8FDE\u63A5\u540E\u4FDD\u5B58\u4E3A\u684C\u9762\u51ED\u636E\u3002",
  tools: "\u5DF2\u6CE8\u518C\u5DE5\u5177",
  lastCheck: "\u4E0A\u6B21\u68C0\u6D4B",
  snapshot: "\u6B64\u7ED3\u679C\u662F\u68C0\u6D4B\u5FEB\u7167\uFF0C\u4E0D\u4EE3\u8868\u5B9E\u65F6\u5728\u7EBF\u3002\u8BF7\u5728\u6B63\u5E38 DSH \u4F1A\u8BDD\u4E2D\u786E\u8BA4\u5B9E\u9645\u8C03\u7528\u3002",
  prompt: "\u8BF7\u8C03\u7528 Gemus \u7684 workflow_list\uFF0C\u5217\u51FA\u6211\u7684\u4E2A\u4EBA\u7A7A\u95F4\u5DE5\u4F5C\u6D41\u3002\u4E0D\u8981\u521B\u5EFA\u5DE5\u4F5C\u6D41\u6216\u751F\u6210\u5185\u5BB9\u3002",
  copy: "\u590D\u5236\u9996\u6B21\u4EFB\u52A1",
  copied: "\u5DF2\u590D\u5236",
  model: "\u82E5\u4F1A\u8BDD\u63D0\u793A\u5C1A\u65E0\u6A21\u578B\uFF0C\u8BF7\u5728 DSH \u767B\u5F55\u6216\u914D\u7F6E\u6A21\u578B\u3002Gemus Key \u4E0D\u8D1F\u8D23\u914D\u7F6E\u6A21\u578B\uFF1B\u6B63\u5E38\u804A\u5929\u53EF\u80FD\u6D88\u8017\u6A21\u578B\u989D\u5EA6\u3002",
  "status.disconnected": "\u672A\u8FDE\u63A5",
  "status.checking": "\u68C0\u6D4B\u4E2D\u2026",
  "status.verified": "\u8D26\u6237\u9A8C\u8BC1\u901A\u8FC7\uFF0C\u5DE5\u5177\u5DF2\u6CE8\u518C",
  "status.needs-check": "\u5C1A\u672A\u9A8C\u8BC1\u3002\u63D2\u4EF6\u4FDD\u6301\u542F\u7528\uFF0C\u7B49\u5F85\u81EA\u52A8\u6062\u590D\u3002",
  "status.auth-required": "Key \u65E0\u6548\u6216\u5DF2\u64A4\u9500\uFF0C\u8BF7\u8F93\u5165\u65B0\u7684 Gemus Key\u3002",
  "status.network-error": "\u65E0\u6CD5\u8FDE\u63A5 Gemus\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u91CD\u65B0\u68C0\u6D4B\u3002",
  "status.host-incompatible": "\u63D2\u4EF6\u672A\u80FD\u6FC0\u6D3B\uFF0C\u8BF7\u68C0\u67E5 DSH \u7248\u672C\u6216\u5176\u4ED6 Gemus \u63D2\u4EF6\u51B2\u7A81\u3002",
  "status.storage-error": "\u65E0\u6CD5\u4FDD\u5B58\u8FDE\u63A5\uFF0C\u539F\u51ED\u636E\u4FDD\u6301\u4E0D\u53D8\u3002",
  "error.auth-required": "\u672A\u63A5\u53D7\u8FD9\u4E2A Key\uFF0C\u539F\u8FDE\u63A5\u5C1A\u672A\u88AB\u66FF\u6362\u3002",
  "error.network-error": "\u65E0\u6CD5\u9A8C\u8BC1 Gemus\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u548C\u670D\u52A1\u5730\u5740\u3002",
  "error.storage-error": "\u4FDD\u5B58\u5931\u8D25\uFF0C\u8FDE\u63A5\u5C1A\u672A\u4FDD\u5B58\u3002",
  "error.conflict": "\u8FDE\u63A5\u5DF2\u5728\u5176\u4ED6\u4F4D\u7F6E\u66F4\u6539\uFF0C\u8BF7\u91CD\u65B0\u68C0\u6D4B\u4EE5\u52A0\u8F7D\u5F53\u524D\u8FDE\u63A5\u3002",
  "status.server-incompatible": "\u5F53\u524D Gemus \u670D\u52A1\u6682\u4E0D\u652F\u6301\u8D26\u6237\u9A8C\u8BC1\u3002",
  "error.server-incompatible": "\u8BF7\u8054\u7CFB Gemus \u670D\u52A1\u7BA1\u7406\u5458\u66F4\u65B0\u670D\u52A1\u540E\u91CD\u65B0\u68C0\u6D4B\u3002\u5DF2\u6CE8\u518C\u7684\u5DE5\u5177\u4ECD\u53EF\u80FD\u5728\u4F1A\u8BDD\u4E2D\u4F7F\u7528\u3002",
  "error.invalid-endpoint": "\u8BF7\u4F7F\u7528 HTTPS\uFF0C\u6216\u672C\u673A HTTP\u3002\u5730\u5740\u4E0D\u80FD\u5305\u542B\u51ED\u636E\u3001\u67E5\u8BE2\u53C2\u6570\u6216\u7247\u6BB5\u3002",
  "error.host-incompatible": "\u8BF7\u68C0\u67E5 DSH \u7248\u672C\uFF0C\u4EE5\u53CA\u662F\u5426\u6709\u5176\u4ED6 Gemus \u63D2\u4EF6\u5360\u7528\u4E86\u5DE5\u5177\u3002",
  "error.cancelled": "\u64CD\u4F5C\u5DF2\u88AB\u66F4\u65B0\u7684\u8BF7\u6C42\u53D6\u4EE3\uFF0C\u8BF7\u91CD\u65B0\u68C0\u6D4B\u3002",
  loading: "\u6B63\u5728\u8BFB\u53D6 Gemus \u8FDE\u63A5\u2026",
  unavailable: "\u65E0\u6CD5\u8BFB\u53D6\u63D2\u4EF6\u8FDE\u63A5\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u6B64\u9875\u6216\u68C0\u67E5 DSH \u8FDE\u63A5\u3002",
  retry: "\u91CD\u8BD5"
};

// src/client.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var NS = "gemusConnection";
var stack = { display: "flex", flexDirection: "column", gap: 12, color: "var(--dsw-alias-text-primary)" };
var hint = { color: "var(--dsw-alias-text-secondary)", fontSize: 13, margin: 0 };
function connectPageUrl(endpoint) {
  try {
    const url = new URL(endpoint);
    if (url.protocol === "https:" || url.protocol === "http:") return new URL("/connect", url).href;
  } catch {
  }
  return "https://gemus.ai/connect";
}
function ConnectionPanel({ api, t }) {
  const [view2, setView] = (0, import_react.useState)(null);
  const [key, setKey] = (0, import_react.useState)("");
  const [endpoint, setEndpoint] = (0, import_react.useState)(DEFAULT_ENDPOINT);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [failed, setFailed] = (0, import_react.useState)(false);
  const [copied, setCopied] = (0, import_react.useState)(false);
  const sequence = (0, import_react.useRef)(0);
  const connectPage = connectPageUrl(endpoint);
  const perform = async (operation) => {
    const id = ++sequence.current;
    setBusy(true);
    setFailed(false);
    try {
      const next = await operation();
      if (sequence.current === id) {
        setView(next);
        setEndpoint(next.endpoint);
      }
    } catch {
      if (sequence.current === id) setFailed(true);
    } finally {
      if (sequence.current === id) setBusy(false);
    }
  };
  (0, import_react.useEffect)(() => {
    void perform(() => api.getStatus());
    return () => {
      sequence.current++;
    };
  }, [api]);
  const submit = (event) => {
    event.preventDefault();
    if (!view2 || busy) return;
    const input = { apiKey: key, endpoint, expectedRevision: view2.revision };
    setKey("");
    void perform(() => api.connect(input));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { style: stack, "aria-label": t("title"), children: [
    !view2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "status", children: t(failed ? "unavailable" : "loading") }),
    failed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "alert", children: t("unavailable") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { disabled: busy, onClick: () => void perform(() => api.getStatus()), children: t("retry") })
    ] }),
    view2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "status", children: t(busy ? "status.checking" : `status.${view2.status}`) }),
      view2.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { role: "alert", children: t(`error.${view2.error}`) }),
      view2.identity && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: stack, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          t("account"),
          ": ",
          view2.identity.user.displayName,
          " ",
          view2.identity.user.username && `(@${view2.identity.user.username})`
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          t("space"),
          ": ",
          view2.identity.personalWorkspace?.name ?? t("noSpace")
        ] })
      ] }),
      view2.saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: hint, children: t("saved") }),
      view2.source === "environment" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: hint, children: t("environment") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: submit, style: stack, autoComplete: "off", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { htmlFor: "gemus-key", children: t("key") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Input, { id: "gemus-key", type: "password", value: key, autoComplete: "off", spellCheck: false, disabled: busy, onChange: (event) => setKey(event.target.value), "aria-describedby": "gemus-key-hint" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { id: "gemus-key-hint", style: hint, children: [
          t("keyHint"),
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href: connectPage, target: "_blank", rel: "noreferrer", children: connectPage.replace(/^https?:\/\//, "") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", { children: t("advanced") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: stack, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { htmlFor: "gemus-endpoint", children: t("endpoint") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Input, { id: "gemus-endpoint", type: "url", value: endpoint, disabled: busy, onChange: (event) => {
              setEndpoint(event.target.value);
              setKey("");
            } })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { variant: "primary", type: "submit", disabled: busy || !key.trim(), children: t(view2.identity ? "replace" : "connect") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { type: "button", disabled: busy, onClick: () => void perform(() => api.recheck(view2.revision)), children: t("recheck") }),
          view2.source !== "none" && view2.status !== "disconnected" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { type: "button", disabled: busy, onClick: () => void perform(() => api.disconnect(view2.revision)), children: t("disconnect") })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: hint, children: [
        t("tools"),
        ": ",
        view2.toolCount
      ] }),
      view2.checkedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: hint, children: [
        t("lastCheck"),
        ": ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { dateTime: view2.checkedAt, children: new Date(view2.checkedAt).toLocaleString() })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: hint, children: t("snapshot") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Button, { disabled: !view2.identity || busy, onClick: async () => {
        if (await (0, import_dsh_client_ui_primitives.writeClipboard)(t("prompt"))) setCopied(true);
      }, children: t(copied ? "copied" : "copy") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: hint, children: t("model") })
    ] })
  ] });
}
var inject = ["slots", "locale", "remote"];
async function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { en, zh }));
  const unmount = await ctx.remote.$mount(GEMUS_REMOTE);
  ctx.effect(() => unmount);
  const call = async (operation) => {
    const result = await operation;
    if (!result.ok) throw new Error("Gemus configuration unavailable");
    return result.value;
  };
  ctx.inject(["remote.gemusConnection"], (scope) => {
    const api = {
      getStatus: () => call(scope.remote.gemusConnection.getStatus()),
      connect: (input) => call(scope.remote.gemusConnection.connect(input)),
      recheck: (revision) => call(scope.remote.gemusConnection.recheck(revision)),
      disconnect: (revision) => call(scope.remote.gemusConnection.disconnect(revision))
    };
    scope.effect(() => scope.slots.inject("plugins.bundle.config", () => scope.slots.register({
      name: "plugins.bundle.config",
      key: "gemus-dsh-plugin",
      locale: NS,
      inject: () => ({ api })
    }, ConnectionPanel)));
  });
}
return module.exports; } });
