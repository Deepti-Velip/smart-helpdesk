import { useEffect, useState } from "react";
import api from "../../axios/index"; // your centralized axios instance

export default function Settings() {
  const [config, setConfig] = useState({
    autoCloseEnabled: false,
    confidenceThreshold: 0.8,
    slaHours: 24,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/config");
        setConfig(res.data);
      } catch (err) {
        console.error("Failed to fetch config:", err);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig({ ...config, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = async () => {
    try {
      const res = await api.put("/config", config);
      setConfig(res.data);
      alert("Config updated successfully!");
    } catch (err) {
      console.error("Failed to update config:", err);
      alert("Error updating config");
    }
  };

  return (
    <div className="py-24 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">System Settings</h2>

      <label className="block mb-3">
        <input
          type="checkbox"
          name="autoCloseEnabled"
          checked={config.autoCloseEnabled}
          onChange={handleChange}
        />{" "}
        Auto-Close Tickets
      </label>

      <label className="block mb-3">
        Confidence Threshold:
        <input
          type="number"
          name="confidenceThreshold"
          min="0"
          max="1"
          step="0.01"
          value={config.confidenceThreshold}
          onChange={handleChange}
          className="border ml-2 px-2 py-1"
        />
      </label>

      <label className="block mb-3">
        SLA Hours:
        <input
          type="number"
          name="slaHours"
          value={config.slaHours}
          onChange={handleChange}
          className="border ml-2 px-2 py-1"
        />
      </label>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Save Settings
      </button>
    </div>
  );
}
