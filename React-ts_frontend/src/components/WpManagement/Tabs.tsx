// components/Tabs.tsx
type Tab = { id: string; label: string };

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 mb-6 border-b border-green-100">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`pb-2 px-3 font-medium rounded-t ${
            activeTab === tab.id
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-700 hover:text-gray-900 hover:bg-blue-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
