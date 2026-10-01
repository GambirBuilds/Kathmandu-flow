/**
 * LocalStorage scenario persistence service
 */

const STORAGE_KEY = 'kathmandu_flow_custom_scenarios_v1';

export function getCustomScenarios() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse custom scenarios from localStorage:', err);
    return [];
  }
}

export function saveCustomScenario(scenario) {
  try {
    const existing = getCustomScenarios();
    const newScenario = {
      ...scenario,
      id: scenario.id || `custom_${Date.now()}`,
      createdAt: scenario.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isCustom: true
    };

    const index = existing.findIndex((s) => s.id === newScenario.id);
    let updated;
    if (index >= 0) {
      updated = [...existing];
      updated[index] = newScenario;
    } else {
      updated = [newScenario, ...existing];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newScenario;
  } catch (err) {
    console.error('Failed to save scenario to localStorage:', err);
    return null;
  }
}

export function deleteCustomScenario(scenarioId) {
  try {
    const existing = getCustomScenarios();
    const filtered = existing.filter((s) => s.id !== scenarioId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete scenario from localStorage:', err);
    return false;
  }
}

export function exportScenariosAsJSON(scenarios) {
  try {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scenarios, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kathmandu_flow_scenarios_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  } catch (err) {
    console.error('Export failed:', err);
    return false;
  }
}
