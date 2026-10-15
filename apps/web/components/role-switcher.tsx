"use client";

import { useEffect, useState } from "react";
import { keys, readSandbox, roleLabels, type SandboxRole, writeSandbox } from "../lib/sandbox-store";

const roles = Object.entries(roleLabels) as Array<[SandboxRole, string]>;

export function RoleSwitcher() {
  const [role, setRole] = useState<SandboxRole>("citizen");

  useEffect(() => setRole(readSandbox<SandboxRole>(keys.role, "citizen")), []);

  function changeRole(nextRole: SandboxRole) {
    setRole(nextRole);
    writeSandbox(keys.role, nextRole);
  }

  return (
    <div className="role-switcher">
      <span aria-hidden="true">Sandbox</span>
      <label htmlFor="sandbox-role" className="sr-only">Choose sandbox role</label>
      <select id="sandbox-role" value={role} onChange={(event) => changeRole(event.target.value as SandboxRole)}>
        {roles.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
      </select>
    </div>
  );
}
