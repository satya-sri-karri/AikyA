import { useEffect, useState } from "react";
import { api } from "../api/client.js";

// Splits a dotted field name into path parts, e.g. "accessPolicy.note" -> ["accessPolicy", "note"]
function setByPath(obj, path, value) {
  const parts = path.split(".");
  let cursor = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cursor[parts[i]]) cursor[parts[i]] = {};
    cursor = cursor[parts[i]];
  }
  cursor[parts[parts.length - 1]] = value;
  return obj;
}

function getByPath(obj, path) {
  return path.split(".").reduce((acc, part) => (acc == null ? acc : acc[part]), obj);
}

// Normalise a full record (from the API) into flat form state.
function recordToForm(record, fields) {
  const form = {};
  for (const field of fields) {
    const raw = getByPath(record, field.name);
    if (field.type === "list") form[field.name] = Array.isArray(raw) ? raw.join(", ") : "";
    else if (field.type === "stops") form[field.name] = Array.isArray(raw) ? raw : [];
    else form[field.name] = raw ?? (field.type === "checkbox" ? false : field.type === "number" ? "" : "");
  }
  return form;
}

function formToPayload(form, fields) {
  const payload = {};
  for (const field of fields) {
    const value = form[field.name];
    let out;
    if (field.type === "list") {
      out = typeof value === "string"
        ? value.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
    } else if (field.type === "stops") {
      out = Array.isArray(value)
        ? value.map((row) => ({ name: (row.name || "").trim(), time: (row.time || "").trim() })).filter((row) => row.name && row.time)
        : [];
    } else if (field.type === "checkbox") {
      out = !!value;
    } else if (field.type === "number") {
      out = value === "" || value == null ? undefined : Number(value);
    } else {
      out = value || undefined;
    }
    if (out !== undefined) setByPath(payload, field.name, out);
  }
  return payload;
}

function FieldInput({ field, value, onChange }) {
  if (field.type === "checkbox") {
    return (
      <label className="admin-field admin-check">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
      </label>
    );
  }
  if (field.type === "select") {
    return (
      <label className="admin-field">
        <span>{field.label}</span>
        <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt || "(none)"}</option>
          ))}
        </select>
      </label>
    );
  }
  if (field.type === "textarea") {
    return (
      <label className="admin-field">
        <span>{field.label}</span>
        <textarea rows={2} value={value || ""} onChange={(e) => onChange(e.target.value)} />
      </label>
    );
  }
  if (field.type === "stops") {
    const rows = Array.isArray(value) ? value : [];
    const update = (idx, key, v) =>
      onChange(rows.map((row, i) => (i === idx ? { ...row, [key]: v } : row)));
    return (
      <div className="admin-field">
        <span>{field.label}</span>
        {rows.map((row, idx) => (
          <div key={idx} className="admin-stops-row">
            <input placeholder="Stop name" value={row.name || ""} onChange={(e) => update(idx, "name", e.target.value)} />
            <input placeholder="Time" value={row.time || ""} onChange={(e) => update(idx, "time", e.target.value)} />
            <button type="button" className="admin-icon-btn" onClick={() => onChange(rows.filter((_, i) => i !== idx))}>✕</button>
          </div>
        ))}
        <button type="button" className="admin-add-stop" onClick={() => onChange([...rows, { name: "", time: "" }])}>
          + Add stop
        </button>
      </div>
    );
  }
  return (
    <label className="admin-field">
      <span>{field.label}</span>
      <input
        type={field.type === "number" ? "number" : "text"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function RecordForm({ entity, record, onDone }) {
  const [form, setForm] = useState(() => recordToForm(record || {}, entity.fields));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setValue = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = formToPayload(form, entity.fields);
      if (record) await api.update(entity.key, record._id, payload);
      else await api.create(entity.key, payload);
      onDone();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="admin-form-wrap">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{record ? `Edit ${entity.label.slice(0, -1)}` : `Add ${entity.label.slice(0, -1)}`}</h3>
        {entity.fields.map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            value={form[field.name]}
            onChange={(v) => setValue(field.name, v)}
          />
        ))}
        {error && <div className="admin-error">{error}</div>}
        <div className="admin-form-actions">
          <button type="submit" className="admin-btn primary" disabled={saving}>
            {saving ? "Saving..." : record ? "Save changes" : "Add record"}
          </button>
          <button type="button" className="admin-btn" onClick={onDone}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function topFields(entity) {
  return entity.fields.filter((f) => f.type !== "stops").slice(0, 3);
}

function previewValue(record, field) {
  const v = getByPath(record, field.name);
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object" && v) return "";
  return String(v ?? "");
}

const LIST_GETTERS = {
  poi: "getPOIs",
  departments: "getDepartments",
  faculty: "getFaculty",
  buses: "getBuses",
  events: "getEvents",
};

export default function AdminCrud({ entity }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = not editing, object = edit, "new" = add
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const getter = LIST_GETTERS[entity.key] || `get${entity.key.charAt(0).toUpperCase()}${entity.key.slice(1)}`;
      const data = await api[getter]();
      setRecords(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity.key]);

  async function handleDelete(record) {
    if (!window.confirm(`Delete "${record.name || record.title || record.routeNumber || record._id}"?`)) return;
    try {
      await api.remove(entity.key, record._id);
      setRecords((rs) => rs.filter((r) => r._id !== record._id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (error) return <div className="admin-error">{error}</div>;

  const displayFields = topFields(entity);
  const list = records;

  return (
    <div className="admin-crud">
      <div className="admin-crud-head">
        <div>
          <h2>{entity.label}</h2>
          <p className="muted">{entity.description}</p>
        </div>
        <button className="admin-btn primary" onClick={() => setEditing("new")}>+ Add {entity.label.slice(0, -1)}</button>
      </div>

      {editing != null && (
        <RecordForm entity={entity} record={editing === "new" ? null : editing} onDone={() => { setEditing(null); load(); }} />
      )}

      {loading ? (
        <p className="muted">Loading...</p>
      ) : list.length === 0 ? (
        <p className="muted">No records yet. Add the first one above.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {displayFields.map((f) => <th key={f.name}>{f.label}</th>)}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((record) => (
                <tr key={record._id}>
                  {displayFields.map((f) => <td key={f.name}>{previewValue(record, f)}</td>)}
                  <td className="admin-row-actions">
                    <button className="admin-btn small" onClick={() => setEditing(record)}>Edit</button>
                    <button className="admin-btn small danger" onClick={() => handleDelete(record)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}