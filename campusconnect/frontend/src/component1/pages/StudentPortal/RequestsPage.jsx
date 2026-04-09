/**
 * ResourcesPage.jsx
 * "My Resources" — shows all files the student has uploaded
 * Place in: src/pages/student/ResourcesPage.jsx
 */

import { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { T } from "./StudentData";
import {
  FileText, Download, Trash2, Upload, Search,
  ChevronDown, X, BookOpen,
} from "lucide-react";

export default function ResourcesPage() {
  const { isDark } = useTheme();
  const t = T(isDark);

  return (
    <div className={`min-h-full ${t.pageBg} p-6`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className={`text-xl font-black flex items-center gap-2 ${t.textPrimary}`}>
          Comming Soon
        </h2>
        <p className={`text-sm mt-0.5 ${t.textSecondary}`}>All requests you sent</p>
      </div>
    </div>
  );
}