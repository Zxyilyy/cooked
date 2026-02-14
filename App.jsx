import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  Calculator,
  ShoppingBag,
  Info,
  TrendingUp,
  PieChart,
  DollarSign,
  Archive,
  Truck,
  Save,
  X,
  Package,
  Wrench,
  RefreshCw,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  NotebookPen,
  Search,
  History,
  RotateCcw,
  Utensils,
  Ban,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Calendar,
  Filter,
  Circle,
  Columns,
  Download,
  Upload,
  Database,
} from 'lucide-react';

// --- 自定义 Hook: 自动同步 LocalStorage ---
const useStickyState = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (err) {
      return defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

// --- 子组件：时间筛选栏 (强制深色字体) ---
const DateFilterBar = ({ filter, setFilter }) => {
  if (!filter || !setFilter) return null;
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between mb-4">
      <div className="flex bg-slate-100 p-1 rounded-lg">
        {['day', 'week', 'month', 'year'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter({ ...filter, type: t })}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              filter.type === t
                ? 'bg-white text-indigo-700 shadow-sm border border-indigo-100'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t === 'day'
              ? '按日'
              : t === 'week'
              ? '按周'
              : t === 'month'
              ? '按月'
              : '按年'}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-600">选择时间:</span>
        <input
          type={
            filter.type === 'month'
              ? 'month'
              : filter.type === 'year'
              ? 'number'
              : 'date'
          }
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          className="border-2 border-slate-300 rounded-lg p-2 text-sm font-bold outline-none focus:ring-2 ring-indigo-500 text-gray-900 bg-white"
          placeholder={filter.type === 'year' ? '例如 2026' : ''}
        />
      </div>
    </div>
  );
};

const BakingApp = () => {
  // --- 1. 基础数据 (完整版) ---
  const initialData = useMemo(() => {
    const rawData = [
      // 1. 本次进货 (2026-02-13)
      {
        id: 'c1',
        name: '澳洲Queen香草膏',
        quantity: 140,
        unit: 'g',
        price: 88.0,
        type: 'ingredient',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c2',
        name: '若竹抹茶粉',
        quantity: 50,
        unit: 'g',
        price: 29.98,
        type: 'ingredient',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c3',
        name: '直身6寸活底模具(2个)',
        quantity: 2,
        unit: '个',
        price: 29.94,
        type: 'tool',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c4',
        name: '烘焙纸托6寸(30个)',
        quantity: 30,
        unit: '个',
        price: 25.71,
        type: 'packaging',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c5',
        name: '茉莉花粉',
        quantity: 100,
        unit: 'g',
        price: 8.96,
        type: 'ingredient',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c6',
        name: '巴斯克6寸油纸(100个)',
        quantity: 100,
        unit: '个',
        price: 14.8,
        type: 'packaging',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c7',
        name: '刨丝器',
        quantity: 1,
        unit: '个',
        price: 15.58,
        type: 'tool',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c8',
        name: '80目筛网',
        quantity: 1,
        unit: '个',
        price: 12.8,
        type: 'tool',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c9',
        name: '量杯1000ml(2个)',
        quantity: 2,
        unit: '个',
        price: 20.8,
        type: 'tool',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c10',
        name: '电子厨房秤',
        quantity: 1,
        unit: '个',
        price: 55.9,
        type: 'tool',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c11',
        name: '手动打蛋器',
        quantity: 1,
        unit: '个',
        price: 36.9,
        type: 'tool',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c12',
        name: '锡纸(1卷)',
        quantity: 1,
        unit: '卷',
        price: 12.8,
        type: 'consumable',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c13',
        name: '丁晴手套(100只)',
        quantity: 100,
        unit: '只',
        price: 23.8,
        type: 'consumable',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c14',
        name: '玫瑰花酱',
        quantity: 200,
        unit: 'g',
        price: 32.0,
        type: 'ingredient',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c15',
        name: '蓝风车淡奶油',
        quantity: 1000,
        unit: 'ml',
        price: 65.5,
        type: 'ingredient',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c16',
        name: '总统淡奶油',
        quantity: 1000,
        unit: 'ml',
        price: 49.8,
        type: 'ingredient',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c17',
        name: '硅胶刀',
        quantity: 1,
        unit: '个',
        price: 19.5,
        type: 'tool',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c18',
        name: '挤酱瓶(3个)',
        quantity: 3,
        unit: '个',
        price: 8.8,
        type: 'tool',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c19',
        name: '不锈钢奶锅',
        quantity: 1,
        unit: '个',
        price: 44.6,
        type: 'tool',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c20',
        name: '平口切刀',
        quantity: 1,
        unit: '个',
        price: 46.47,
        type: 'tool',
        batch: '2026-02-13',
        count: 1,
      },
      {
        id: 'c21',
        name: '蘸料蝶不锈钢(2个)',
        quantity: 2,
        unit: '个',
        price: 9.8,
        type: 'tool',
        batch: '2026-02-13',
        count: 1,
      },
      // 2. 历史固定资产
      {
        id: 'h1',
        name: '商用烤箱',
        quantity: 1,
        unit: '台',
        price: 1550.0,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h2',
        name: '摆摊推车',
        quantity: 1,
        unit: '个',
        price: 199.23,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h3',
        name: '电磁炉',
        quantity: 1,
        unit: '个',
        price: 169.0,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h4',
        name: '露营灯',
        quantity: 1,
        unit: '个',
        price: 60.0,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h5',
        name: '摆摊椅子(2个)',
        quantity: 2,
        unit: '个',
        price: 41.0,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h6',
        name: '日本巴斯克6寸模具',
        quantity: 1,
        unit: '个',
        price: 21.55,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h7',
        name: '日本直身6寸活底模具',
        quantity: 1,
        unit: '个',
        price: 18.68,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h8',
        name: '烤箱温度计',
        quantity: 1,
        unit: '个',
        price: 24.9,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h9',
        name: '手持温度计',
        quantity: 1,
        unit: '个',
        price: 41.0,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h10',
        name: '面包切刀两件套',
        quantity: 1,
        unit: '套',
        price: 26.29,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h11',
        name: '蛋糕切分器(5切)',
        quantity: 1,
        unit: '个',
        price: 18.6,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h12',
        name: '慕斯圈12件套',
        quantity: 1,
        unit: '套',
        price: 11.78,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h13',
        name: '玻璃量杯',
        quantity: 1,
        unit: '个',
        price: 15.88,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h14',
        name: '不锈钢老打蛋器',
        quantity: 1,
        unit: '个',
        price: 25.9,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h15',
        name: '筛网31目16cm',
        quantity: 1,
        unit: '个',
        price: 11.9,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h16',
        name: '筛网31目25cm',
        quantity: 1,
        unit: '个',
        price: 23.9,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h17',
        name: '三角铲子',
        quantity: 1,
        unit: '个',
        price: 18.1,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h18',
        name: '曲奇烤垫',
        quantity: 1,
        unit: '个',
        price: 23.37,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      {
        id: 'h19',
        name: '泡芙裱花嘴(3个)',
        quantity: 3,
        unit: '个',
        price: 5.22,
        type: 'tool',
        batch: '历史资产',
        count: 1,
      },
      // 3. 历史原料
      {
        id: 'm1',
        name: 'Kiri奶油奶酪(2kg)',
        quantity: 2000,
        unit: 'g',
        price: 168.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm1_b',
        name: 'Kiri奶油奶酪(1kg)',
        quantity: 1000,
        unit: 'g',
        price: 85.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 2,
      },
      {
        id: 'm2',
        name: '大利年奶油奶酪(2kg)',
        quantity: 2000,
        unit: 'g',
        price: 105.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm3',
        name: '卡夫菲力奶油奶酪(2kg)',
        quantity: 2000,
        unit: 'g',
        price: 148.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm4',
        name: '铁塔奶油奶酪(2kg)',
        quantity: 2000,
        unit: 'g',
        price: 145.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm5',
        name: '安佳黄油(454g)',
        quantity: 454,
        unit: 'g',
        price: 46.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm6',
        name: '安佳淡奶油(1L)',
        quantity: 1000,
        unit: 'ml',
        price: 45.8,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm6_b',
        name: '安佳淡奶油(1L)补货',
        quantity: 1000,
        unit: 'ml',
        price: 45.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm7',
        name: '铁塔淡奶油(1L)',
        quantity: 1000,
        unit: 'ml',
        price: 56.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm8',
        name: '韩国细砂糖(2.5kg)',
        quantity: 2500,
        unit: 'g',
        price: 29.5,
        type: 'ingredient',
        batch: '历史采购',
        count: 2,
      },
      {
        id: 'm9',
        name: '赤砂糖(1kg)',
        quantity: 1000,
        unit: 'g',
        price: 19.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm10',
        name: '正荣翠绿开心果酱(500g)',
        quantity: 500,
        unit: 'g',
        price: 121.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm11',
        name: '水怡(700g)',
        quantity: 700,
        unit: 'g',
        price: 16.5,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm12',
        name: '川宁伯爵红茶(100g)',
        quantity: 100,
        unit: 'g',
        price: 55.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm13',
        name: '嘉利宝70%黑巧(500g)',
        quantity: 500,
        unit: 'g',
        price: 78.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm14',
        name: '嘉利宝32%白巧(500g)',
        quantity: 500,
        unit: 'g',
        price: 77.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm15',
        name: '玉米油(350ml)',
        quantity: 350,
        unit: 'ml',
        price: 10.48,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm16',
        name: '鸡蛋(30个)',
        quantity: 30,
        unit: '个',
        price: 18.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm17',
        name: '炼乳(185g)',
        quantity: 185,
        unit: 'g',
        price: 8.4,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm18',
        name: '黄油牛乳(1L)',
        quantity: 1000,
        unit: 'ml',
        price: 28.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm19',
        name: '美雅士黑朗姆酒(750ml)',
        quantity: 750,
        unit: 'ml',
        price: 81.0,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'm20',
        name: '茉莉雪芽茶叶(500g)',
        quantity: 500,
        unit: 'g',
        price: 57.5,
        type: 'ingredient',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'p1',
        name: '手提袋"祝你天天开心"(100个)',
        quantity: 100,
        unit: '个',
        price: 33.6,
        type: 'packaging',
        batch: '历史采购',
        count: 1,
      },
      {
        id: 'p2',
        name: '木浆盒+勺子套装(50套)',
        quantity: 50,
        unit: '套',
        price: 26.29,
        type: 'packaging',
        batch: '历史采购',
        count: 1,
      },
    ];

    return rawData.map((item) => {
      let stock = 0;
      if (item.type === 'tool') stock = item.count;
      else if (item.batch === '2026-02-13') stock = item.quantity * item.count;
      else stock = 0;
      return { ...item, currentStock: stock };
    });
  }, []);

  // --- 2. 状态定义 ---
  const [activeTab, setActiveTab] = useState('inventory');

  // 持久化状态
  const [allInventory, setAllInventory] = useStickyState(
    'baking_inventory_v3',
    initialData
  );
  const [salesRecords, setSalesRecords] = useStickyState('baking_sales_v3', []);
  const [productionLogs, setProductionLogs] = useStickyState(
    'baking_logs_v3',
    []
  );
  const [finishedGoods, setFinishedGoods] = useStickyState(
    'baking_goods_v3',
    []
  );

  // 临时UI状态
  const [recipeItems, setRecipeItems] = useState([]);
  const [recipeName, setRecipeName] = useState('原味巴斯克');
  const [cakeSize, setCakeSize] = useState('6寸');
  const [cutStrategy, setCutStrategy] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: '',
    onConfirm: null,
  });
  const [actionDialog, setActionDialog] = useState({
    isOpen: false,
    type: null,
    product: null,
  });
  const [actionForm, setActionForm] = useState({ quantity: '', price: '' });
  const [expandedDates, setExpandedDates] = useState({});
  const [statsFilter, setStatsFilter] = useState({
    type: 'day',
    date: new Date().toISOString().split('T')[0],
  });
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    quantity: '',
    unit: 'g',
    type: 'ingredient',
    date: new Date().toISOString().split('T')[0],
    count: '1',
  });
  const fileInputRef = useRef(null);

  const miscExpenses = 200;

  // --- 3. 核心工具 ---
  const formatMoney = (amount) => `¥${Number(amount || 0).toFixed(2)}`;
  const normalizeName = (name) =>
    name
      .replace(/[\(（].*?[\)）]/g, '')
      .trim()
      .toLowerCase();

  // --- 4. 数据导入导出 ---
  const handleExportData = () => {
    const data = {
      allInventory,
      salesRecords,
      productionLogs,
      finishedGoods,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `baking_backup_${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToastMsg('数据已导出');
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.allInventory) setAllInventory(data.allInventory);
        if (data.salesRecords) setSalesRecords(data.salesRecords);
        if (data.productionLogs) setProductionLogs(data.productionLogs);
        if (data.finishedGoods) setFinishedGoods(data.finishedGoods);
        showToastMsg('数据恢复成功！');
      } catch (err) {
        showToastMsg('文件格式错误', 'error');
      }
    };
    reader.readAsText(file);
  };

  // --- 5. 逻辑计算 ---
  const materialStockList = useMemo(
    () =>
      Array.isArray(allInventory)
        ? allInventory.filter((i) => i.type !== 'tool')
        : [],
    [allInventory]
  );
  const toolsList = useMemo(
    () =>
      Array.isArray(allInventory)
        ? allInventory.filter((i) => i.type === 'tool')
        : [],
    [allInventory]
  );

  const isDateInFilterRange = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const filterDate = new Date(statsFilter.date);
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const selected = new Date(
      filterDate.getFullYear(),
      filterDate.getMonth(),
      filterDate.getDate()
    );

    if (statsFilter.type === 'day')
      return target.getTime() === selected.getTime();
    if (statsFilter.type === 'week') {
      const day = selected.getDay() || 7;
      const start = new Date(selected);
      start.setDate(selected.getDate() - day + 1);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return target >= start && target <= end;
    }
    if (statsFilter.type === 'month')
      return (
        d.getFullYear() === filterDate.getFullYear() &&
        d.getMonth() === filterDate.getMonth()
      );
    if (statsFilter.type === 'year')
      return d.getFullYear() === filterDate.getFullYear();
    return false;
  };

  const financials = useMemo(() => {
    let invested = miscExpenses;
    let assets = 0;
    let invVal = 0;
    if (Array.isArray(allInventory)) {
      allInventory.forEach((item) => {
        const total = item.price * item.count;
        invested += total;
        if (item.type === 'tool') assets += total;
        else if (
          item.batch === '2026-02-13' ||
          (item.id && item.id.toString().startsWith('new_'))
        ) {
          const fullQty = item.quantity * item.count;
          if (fullQty > 0)
            invVal += total * (Math.max(0, item.currentStock) / fullQty);
        }
      });
    }
    return { invested, assets, invVal };
  }, [allInventory]);

  const aggregatedInventory = useMemo(() => {
    const grouped = {};
    if (Array.isArray(allInventory)) {
      allInventory.forEach((item) => {
        if (item.type === 'tool') return;
        const cleanName = normalizeName(item.name);
        if (!grouped[cleanName]) {
          grouped[cleanName] = {
            name: item.name.replace(/[\(（].*?[\)）]/g, '').trim(),
            searchKey: cleanName,
            totalStock: 0,
            unit: item.unit,
            type: item.type,
            weightedSum: 0,
            totalForAvg: 0,
            lastPrice: 0,
          };
        }
        grouped[cleanName].totalStock += item.currentStock;
        const unitPrice = item.quantity > 0 ? item.price / item.quantity : 0;
        if (item.currentStock > 0) {
          grouped[cleanName].weightedSum += item.currentStock * unitPrice;
          grouped[cleanName].totalForAvg += item.currentStock;
        } else {
          grouped[cleanName].lastPrice = unitPrice;
        }
      });
    }
    return Object.values(grouped)
      .map((g) => {
        g.avgPrice =
          g.totalForAvg > 0 ? g.weightedSum / g.totalForAvg : g.lastPrice;
        return g;
      })
      .sort((a, b) => a.type.localeCompare(b.type));
  }, [allInventory]);

  const filteredAggregated = useMemo(
    () =>
      aggregatedInventory.filter((i) =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [aggregatedInventory, searchTerm]
  );

  const stats = useMemo(() => {
    const s = { produced: {}, revenue: 0, profit: 0, count: 0, cost: 0 };
    if (Array.isArray(productionLogs)) {
      productionLogs.forEach((log) => {
        if (isDateInFilterRange(log.isoDate)) {
          if (!s.produced[log.productName]) s.produced[log.productName] = {};
          const sizeKey = log.size || '未知';
          if (!s.produced[log.productName][sizeKey])
            s.produced[log.productName][sizeKey] = {
              whole: 0,
              slices: 0,
              equivalent: 0,
            };
          const group = s.produced[log.productName][sizeKey];
          if (log.producedUnit === '个') {
            group.whole += log.producedQuantity;
            group.equivalent += log.producedQuantity;
          } else {
            group.slices += log.producedQuantity;
            group.equivalent +=
              log.producedQuantity / (log.slicesPerWhole || 5);
          }
          s.count += 1;
        }
      });
    }
    if (Array.isArray(salesRecords)) {
      salesRecords.forEach((r) => {
        if (isDateInFilterRange(r.date)) {
          s.revenue += r.price * r.quantity;
          s.cost += r.cost * r.quantity;
          s.profit += (r.price - r.cost) * r.quantity;
        }
      });
    }
    return s;
  }, [productionLogs, salesRecords, statsFilter]);

  const filteredSalesRecords = useMemo(
    () =>
      Array.isArray(salesRecords)
        ? salesRecords
            .filter((r) => isDateInFilterRange(r.date))
            .sort((a, b) => b.id - a.id)
        : [],
    [salesRecords, statsFilter]
  );

  const recipeCost = useMemo(
    () =>
      recipeItems.reduce(
        (sum, item) => sum + item.price * item.usedQuantity,
        0
      ),
    [recipeItems]
  );

  const groupedLogs = useMemo(() => {
    const g = {};
    if (Array.isArray(productionLogs)) {
      productionLogs.forEach((l) => {
        const d = l.isoDate.split('T')[0];
        if (!g[d]) g[d] = [];
        g[d].push(l);
      });
    }
    return Object.entries(g).sort((a, b) => b[0].localeCompare(a[0]));
  }, [productionLogs]);

  // --- 6. 操作函数 ---
  const showToastMsg = (msg, type = 'success') =>
    setToast({ message: msg, type });

  const handleUpdateStock = (id, val) =>
    setAllInventory((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, currentStock: parseFloat(val) || 0 } : i
      )
    );
  const addToRecipe = (item) => {
    if (!recipeItems.find((r) => r.name === item.name)) {
      setRecipeItems([
        ...recipeItems,
        {
          id: `r_${Date.now()}`,
          name: item.name,
          unit: item.unit,
          price: item.avgPrice,
          usedQuantity: 0,
        },
      ]);
    }
  };
  const updateRecipeQuantity = (id, val) =>
    setRecipeItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, usedQuantity: parseFloat(val) || 0 } : i
      )
    );
  const removeFromRecipe = (id) =>
    setRecipeItems((prev) => prev.filter((i) => i.id !== id));

  const handleAddItem = () => {
    const item = {
      id: `n_${Date.now()}`,
      ...newItem,
      price: parseFloat(newItem.price),
      quantity: parseFloat(newItem.quantity),
      count: parseFloat(newItem.count),
      batch: newItem.date,
    };
    item.currentStock =
      item.type === 'tool' ? item.count : item.quantity * item.count;
    setAllInventory([item, ...allInventory]);
    setShowAddForm(false);
    showToastMsg('入库成功');
  };

  const handleProduceCake = () => {
    if (recipeItems.length === 0) return showToastMsg('配方为空', 'error');
    const newInv = [...allInventory];
    let missing = '';

    recipeItems.forEach((r) => {
      const total = newInv
        .filter((i) => normalizeName(i.name) === normalizeName(r.name))
        .reduce((sum, b) => sum + b.currentStock, 0);
      if (total < r.usedQuantity) missing = r.name;
    });
    if (missing) return showToastMsg(`库存不足: ${missing}`, 'error');

    const deductions = [];
    recipeItems.forEach((r) => {
      let rem = r.usedQuantity;
      for (let i = 0; i < newInv.length; i++) {
        if (
          normalizeName(newInv[i].name) === normalizeName(r.name) &&
          newInv[i].currentStock > 0
        ) {
          const deduct = Math.min(newInv[i].currentStock, rem);
          newInv[i].currentStock -= deduct;
          deductions.push({ itemId: newInv[i].id, amount: deduct });
          rem -= deduct;
          if (rem <= 0) break;
        }
      }
    });

    const fullName = `${recipeName} (${cakeSize}${
      cutStrategy === 0 ? '' : `/${cutStrategy}切`
    })`;
    const isWhole = cutStrategy === 0;
    const prodQty = isWhole ? 1 : cutStrategy;
    const prodUnit = isWhole ? '个' : '块';

    setFinishedGoods((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const idx = safePrev.findIndex(
        (g) => g.name === fullName && g.unit === prodUnit
      );
      if (idx !== -1) {
        const next = [...safePrev];
        const newQty = next[idx].quantity + prodQty;
        next[idx].unitCost =
          (next[idx].quantity * next[idx].unitCost + recipeCost) / newQty;
        next[idx].quantity = newQty;
        return next;
      }
      return [
        ...safePrev,
        {
          id: `fg_${Date.now()}`,
          name: fullName,
          quantity: prodQty,
          unit: prodUnit,
          unitCost: recipeCost / prodQty,
        },
      ];
    });

    const now = new Date();
    setProductionLogs([
      {
        id: Date.now(),
        isoDate: now.toISOString(),
        productName: recipeName,
        size: cakeSize,
        slicesPerWhole: cutStrategy || 1,
        totalCost: recipeCost,
        deductions,
        producedQuantity: prodQty,
        producedUnit: prodUnit,
      },
      ...(Array.isArray(productionLogs) ? productionLogs : []),
    ]);

    setRecipeItems([]);
    setAllInventory(newInv);
    setExpandedDates((prev) => ({
      ...prev,
      [now.toISOString().split('T')[0]]: true,
    }));
    showToastMsg('制作成功');
  };

  const handleDeleteProductionLog = (logId) => {
    const log = productionLogs.find((l) => l.id === logId);
    if (!log) return;
    const newInv = [...allInventory];
    log.deductions.forEach((d) => {
      const idx = newInv.findIndex((i) => i.id === d.itemId);
      if (idx !== -1) newInv[idx].currentStock += d.amount;
    });
    const cutSuffix =
      log.producedUnit === '个' ? '' : `/${log.slicesPerWhole}切`;
    const fullName = `${log.productName} (${log.size}${cutSuffix})`;
    setFinishedGoods((prev) =>
      prev
        .map((g) =>
          g.name === fullName && g.unit === log.producedUnit
            ? { ...g, quantity: Math.max(0, g.quantity - log.producedQuantity) }
            : g
        )
        .filter((g) => g.quantity > 0)
    );
    setAllInventory(newInv);
    setProductionLogs(productionLogs.filter((l) => l.id !== logId));
    showToastMsg('已撤销并恢复库存');
  };

  const openSellDialog = (product) => {
    setActionDialog({ isOpen: true, type: 'sell', product });
    setActionForm({
      quantity: '1',
      price: Math.ceil(product.unitCost * 1.6).toString(),
    });
  };

  const openDiscardDialog = (product) => {
    setActionDialog({ isOpen: true, type: 'discard', product });
    setActionForm({ quantity: String(product.quantity), price: '0' });
  };

  const handleDeleteSaleRecord = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: '确定要删除这条销售记录吗？',
      onConfirm: () => {
        setSalesRecords(salesRecords.filter((r) => r.id !== id));
        showToastMsg('销售记录已删除');
        setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
      },
    });
  };

  const handleDeleteItem = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: '确定要删除这条库存记录吗？总投入金额也会相应减少。',
      onConfirm: () => {
        setAllInventory(allInventory.filter((i) => i.id !== id));
        showToastMsg('记录已删除');
        setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
      },
    });
  };

  const handleActionSubmit = () => {
    const { type, product } = actionDialog;
    const qty = parseFloat(actionForm.quantity);
    const prc = parseFloat(actionForm.price);
    if (!product || isNaN(qty) || qty <= 0 || qty > product.quantity)
      return showToastMsg('数量无效或不足', 'error');
    setFinishedGoods((prev) =>
      prev
        .map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity - qty } : i
        )
        .filter((i) => i.quantity > 0)
    );
    setSalesRecords([
      {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        name: type === 'sell' ? product.name : `${product.name} (报废)`,
        cost: product.unitCost,
        price: type === 'sell' ? prc : 0,
        quantity: qty,
      },
      ...(Array.isArray(salesRecords) ? salesRecords : []),
    ]);
    showToastMsg(type === 'sell' ? '售出成功' : '已记录报废损耗');
    setActionDialog({ isOpen: false });
  };

  const toggleDateGroup = (date) =>
    setExpandedDates((prev) => ({ ...prev, [date]: !prev[date] }));

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // --- 7. 渲染 ---

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-xl text-white z-50 font-bold flex items-center gap-2 animate-bounce-in ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-green-600'
          }`}
        >
          {toast.type === 'error' ? (
            <XCircle size={18} />
          ) : (
            <CheckCircle size={18} />
          )}{' '}
          {toast.message.toString()}
        </div>
      )}

      {/* Header */}
      <header className="mb-6 bg-slate-900 text-white p-6 rounded-2xl shadow-xl border-b-4 border-indigo-500">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-xl font-black uppercase tracking-tight">
            🍰 BAKING ERP
          </h1>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase">
              历史总投入
            </p>
            <p className="text-2xl font-black text-yellow-400 tabular-nums">
              {formatMoney(financials.invested)}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl flex justify-between items-center border border-slate-700">
            <div>
              <p className="text-blue-400 text-[10px] font-bold uppercase mb-1">
                当前原料价值
              </p>
              <p className="text-xl font-black tabular-nums">
                {formatMoney(financials.invVal)}
              </p>
            </div>
            <Package className="text-slate-600" size={24} />
          </div>
          <div className="bg-slate-800 p-4 rounded-xl flex justify-between items-center border border-slate-700">
            <div>
              <p className="text-green-400 text-[10px] font-bold uppercase mb-1">
                资产总值
              </p>
              <p className="text-xl font-black tabular-nums">
                {formatMoney(financials.assets)}
              </p>
            </div>
            <Wrench className="text-slate-600" size={24} />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'inventory', label: '原料库存', icon: <Package size={16} /> },
          {
            id: 'calculator',
            label: '制作减扣',
            icon: <Calculator size={16} />,
          },
          { id: 'products', label: '成品库', icon: <Utensils size={16} /> },
          { id: 'ledger', label: '销售账本', icon: <NotebookPen size={16} /> },
          { id: 'stats', label: '数据总结', icon: <BarChart3 size={16} /> },
          { id: 'data', label: '数据管理', icon: <Database size={16} /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xs whitespace-nowrap transition-all ${
              activeTab === t.id
                ? 'bg-slate-900 text-white shadow-lg'
                : 'bg-white text-slate-500 hover:bg-slate-100'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Inventory */}
      {activeTab === 'inventory' && (
        <div className="space-y-4 animate-in fade-in">
          {!showAddForm ? (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-bold">
                管理原料库存
              </span>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1"
              >
                <Plus size={14} /> 进货
              </button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 mb-6">
              <div className="flex justify-between mb-4">
                <h3 className="font-bold text-indigo-900">录入新进货</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    名称
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    className="w-full p-2 border-2 border-slate-200 rounded-lg text-sm text-gray-900 font-bold outline-none focus:border-indigo-500 bg-white"
                    placeholder="输入名称"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    类型
                  </label>
                  <select
                    value={newItem.type}
                    onChange={(e) =>
                      setNewItem({ ...newItem, type: e.target.value })
                    }
                    className="w-full p-2 border-2 border-slate-200 rounded-lg text-sm text-gray-900 font-bold bg-white outline-none"
                  >
                    <option value="ingredient">原料</option>
                    <option value="packaging">耗材</option>
                    <option value="tool">固定资产</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    总价
                  </label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: e.target.value })
                    }
                    className="w-full p-2 border-2 border-slate-200 rounded-lg text-sm text-gray-900 font-bold outline-none focus:border-indigo-500 bg-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    规格
                  </label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity: e.target.value })
                    }
                    className="w-full p-2 border-2 border-slate-200 rounded-lg text-sm text-gray-900 font-bold outline-none focus:border-indigo-500 bg-white"
                    placeholder="如 500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    单位
                  </label>
                  <select
                    value={newItem.unit}
                    onChange={(e) =>
                      setNewItem({ ...newItem, unit: e.target.value })
                    }
                    className="w-full p-2 border-2 border-slate-200 rounded-lg text-sm text-gray-900 font-bold bg-white outline-none"
                  >
                    <option>g</option>
                    <option>ml</option>
                    <option>个</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">
                    数量
                  </label>
                  <input
                    type="number"
                    value={newItem.count}
                    onChange={(e) =>
                      setNewItem({ ...newItem, count: e.target.value })
                    }
                    className="w-full p-2 border-2 border-slate-200 rounded-lg text-sm text-gray-900 font-bold outline-none focus:border-indigo-500 bg-white"
                    placeholder="1"
                  />
                </div>
              </div>
              <button
                onClick={handleAddItem}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold w-full shadow-lg hover:bg-indigo-700 transition-colors"
              >
                保存入库
              </button>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 border-b">
                <tr>
                  <th className="p-4">批次</th>
                  <th className="p-4">名称</th>
                  <th className="p-4 text-center bg-blue-50/50 text-blue-600">
                    当前库存
                  </th>
                  <th className="p-4 text-right pr-6">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {materialStockList.map((item) => {
                  const isOut = item.currentStock <= 0;
                  const isLow =
                    !isOut && item.currentStock < item.quantity * 0.2;
                  return (
                    <tr
                      key={item.id}
                      className={`${
                        isOut ? 'bg-red-50/30' : isLow ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="p-4 text-slate-400 text-xs font-mono">
                        {item.batch}
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        {item.name}
                      </td>
                      <td className="p-4 text-center">
                        <div
                          className={`inline-flex items-center border-2 rounded-lg overflow-hidden ${
                            isOut
                              ? 'border-red-200 bg-white'
                              : isLow
                              ? 'border-amber-200 bg-white'
                              : 'border-blue-100 bg-white'
                          }`}
                        >
                          <input
                            type="number"
                            value={item.currentStock}
                            onChange={(e) =>
                              handleUpdateStock(item.id, e.target.value)
                            }
                            className={`w-24 p-1.5 text-center font-black outline-none bg-transparent ${
                              isOut
                                ? 'text-red-600'
                                : isLow
                                ? 'text-amber-600'
                                : 'text-blue-700'
                            }`}
                          />
                          <span className="px-2 bg-slate-50 text-[10px] font-bold text-slate-400 border-l">
                            {item.unit}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {isOut ? (
                            <span className="text-red-600 font-bold text-xs flex items-center justify-end gap-1">
                              <Ban size={14} /> 断货
                            </span>
                          ) : isLow ? (
                            <span className="text-amber-600 font-bold text-xs flex items-center justify-end gap-1">
                              <AlertCircle size={14} /> 紧缺
                            </span>
                          ) : (
                            <span className="text-green-600 font-bold text-xs flex items-center justify-end gap-1">
                              <CheckCircle size={14} /> 充足
                            </span>
                          )}
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Calculator */}
      {activeTab === 'calculator' && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col h-[640px]">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              🛒 原料检索
            </h3>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="快速搜索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-2 border-slate-200 rounded-xl outline-none text-sm font-bold text-gray-900 focus:border-indigo-500 focus:bg-white transition-all"
              />
              <Search
                size={16}
                className="absolute left-3.5 top-3.5 text-slate-400"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredAggregated.map((item) => {
                const isOut = item.totalStock <= 0;
                return (
                  <button
                    key={item.name}
                    onClick={() => !isOut && addToRecipe(item)}
                    className={`w-full text-left p-3 rounded-xl border-2 flex justify-between items-center transition-all ${
                      isOut
                        ? 'opacity-40 border-slate-100 bg-slate-50 cursor-not-allowed'
                        : 'border-slate-50 bg-slate-50/50 hover:border-indigo-400 hover:bg-white group'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm text-slate-800">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-bold">
                        余:{' '}
                        <span
                          className={
                            item.totalStock < 50
                              ? 'text-red-500 font-black'
                              : 'text-blue-600'
                          }
                        >
                          {item.totalStock.toFixed(0)}
                          {item.unit}
                        </span>{' '}
                        | 均价: {formatMoney(item.avgPrice)}
                      </p>
                    </div>
                    {!isOut && (
                      <Plus
                        size={18}
                        className="text-indigo-400 group-hover:scale-125"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-4 h-[640px]">
            <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col flex-1 shadow-2xl overflow-hidden">
              <div className="mb-4 space-y-4 shrink-0">
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-slate-700 text-2xl font-black py-1 outline-none focus:border-indigo-400 text-white placeholder-slate-500"
                  placeholder="配方名称"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={cakeSize}
                    onChange={(e) => setCakeSize(e.target.value)}
                    className="bg-slate-800 p-3 rounded-xl text-xs font-bold outline-none border border-slate-700 text-white"
                  >
                    <option>4寸</option>
                    <option>6寸</option>
                    <option>8寸</option>
                  </select>
                  <select
                    value={cutStrategy}
                    onChange={(e) => setCutStrategy(Number(e.target.value))}
                    className="bg-slate-800 p-3 rounded-xl text-xs font-bold outline-none border border-slate-700 text-white"
                  >
                    <option value={0}>整圆 (不切)</option>
                    <option value={5}>切5块</option>
                    <option value={6}>切6块</option>
                    <option value={8}>切8块</option>
                  </select>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto mb-4 bg-slate-800/30 rounded-xl p-4 space-y-2 border border-slate-800">
                {recipeItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 italic">
                    <Calculator size={48} className="mb-2 opacity-20" />
                    <p className="text-xs">选择原料开始构建</p>
                  </div>
                ) : (
                  recipeItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-slate-800 p-2 rounded-lg border-l-4 border-indigo-500"
                    >
                      <div className="flex-1 font-bold text-xs truncate text-slate-200">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={item.usedQuantity}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRecipeItems((prev) =>
                              prev.map((i) =>
                                i.id === item.id
                                  ? { ...i, usedQuantity: parseFloat(val) || 0 }
                                  : i
                              )
                            );
                          }}
                          className="w-16 bg-slate-900 border-none p-1 rounded text-right text-xs font-black text-indigo-400 focus:bg-slate-700 outline-none"
                        />
                        <span className="text-[10px] text-slate-500 font-bold w-4">
                          {item.unit}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setRecipeItems(
                            recipeItems.filter((i) => i.id !== item.id)
                          )
                        }
                        className="text-slate-500 hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="shrink-0 pt-4 border-t border-slate-800 space-y-4">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    预计总成本
                  </p>
                  <p className="text-3xl font-black text-indigo-400 tabular-nums">
                    {formatMoney(recipeCost)}
                  </p>
                </div>
                <button
                  onClick={handleProduceCake}
                  className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-lg hover:bg-indigo-500 shadow-xl shadow-indigo-900/50 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} /> 制作入库
                </button>
              </div>
            </div>

            {/* History List */}
            <div className="bg-white p-4 rounded-xl shadow-sm border h-48 overflow-hidden flex flex-col">
              <h4 className="font-bold text-slate-700 mb-2 text-xs flex items-center gap-1">
                <History size={14} /> 制作流水
              </h4>
              <div className="flex-1 overflow-y-auto">
                {groupedLogs.map(([date, logs]) => (
                  <div key={date} className="mb-2">
                    <div
                      onClick={() => toggleDateGroup(date)}
                      className="bg-slate-100 p-1.5 font-bold text-[10px] flex justify-between cursor-pointer rounded-lg text-slate-600 hover:bg-slate-200"
                    >
                      <span>{date}</span> <span>{logs.length}批</span>
                    </div>
                    {expandedDates[date] &&
                      logs.map((l) => (
                        <div
                          key={l.id}
                          className="flex justify-between p-2 text-[10px] border-b border-dashed border-slate-100 items-center"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700">
                              {l.productName} ({l.size}
                              {l.slicesPerWhole > 1
                                ? `/${l.slicesPerWhole}切`
                                : ''}
                              )
                            </span>
                            <span className="text-slate-400">
                              入库: {l.producedQuantity}
                              {l.producedUnit}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteProductionLog(l.id)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <RotateCcw size={12} />
                          </button>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
          {finishedGoods.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Utensils size={64} className="mx-auto mb-4 opacity-10" />
              <p>暂无成品，请先去制作</p>
            </div>
          ) : (
            finishedGoods.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm group hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 font-black">
                    🍰
                  </div>
                  <span className="bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-black">
                    库存: {p.quantity} {p.unit}
                  </span>
                </div>
                <h4 className="font-black text-slate-800 text-lg mb-1">
                  {p.name}
                </h4>
                <p className="text-xs text-slate-400 font-bold mb-6 italic">
                  单体成本 {formatMoney(p.unitCost)}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openSellDialog(p)}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-black text-xs hover:bg-green-700 shadow-md"
                  >
                    确认售出
                  </button>
                  <button
                    onClick={() => openDiscardDialog(p)}
                    className="px-4 bg-slate-50 text-slate-500 py-2.5 rounded-xl font-bold text-xs hover:text-red-500 hover:bg-red-50 border border-slate-100"
                  >
                    报废
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Ledger Tab */}
      {activeTab === 'ledger' && (
        <div className="space-y-4 animate-in fade-in">
          <DateFilterBar filter={statsFilter} setFilter={setStatsFilter} />
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-purple-600 text-white p-5 rounded-2xl shadow-xl">
              <p className="text-purple-200 text-[10px] font-black uppercase mb-1">
                所选期间净利润
              </p>
              <p className="text-3xl font-black tabular-nums">
                {formatMoney(stats.profit)}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border">
              <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                总营收额
              </p>
              <p className="text-3xl font-black tabular-nums text-slate-800">
                {formatMoney(stats.revenue)}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border">
              <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">
                总原料成本
              </p>
              <p className="text-3xl font-black tabular-nums text-slate-800">
                {formatMoney(stats.cost)}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border overflow-hidden shadow-sm mt-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 border-b">
                <tr>
                  <th className="p-4">时间</th>
                  <th className="p-4">品类</th>
                  <th className="p-4 text-right">成本/售价</th>
                  <th className="p-3 text-center">数量</th>
                  <th className="p-4 text-right pr-8">小计毛利</th>
                  <th className="p-4 text-right pr-4">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSalesRecords.map((r) => {
                  const profit = (r.price - r.cost) * r.quantity;
                  const isLoss = r.price === 0;
                  return (
                    <tr
                      key={r.id}
                      className={isLoss ? 'bg-red-50/50' : 'hover:bg-slate-50'}
                    >
                      <td className="p-4 text-slate-400 font-mono">{r.date}</td>
                      <td className="p-4 font-black text-slate-700">
                        {r.name}
                      </td>
                      <td className="p-4 text-right">
                        <div className="text-[10px] text-slate-300 font-bold">
                          成本:{formatMoney(r.cost)}
                        </div>
                        <div
                          className={`font-black ${
                            isLoss ? 'text-red-400' : 'text-slate-700'
                          }`}
                        >
                          售价:{formatMoney(r.price)}
                        </div>
                      </td>
                      <td className="p-3 text-center font-black text-indigo-500">
                        x{r.quantity}
                      </td>
                      <td
                        className={`p-4 text-right pr-8 font-black ${
                          profit >= 0 ? 'text-green-600' : 'text-red-500'
                        }`}
                      >
                        {formatMoney(profit)}
                      </td>
                      <td className="p-4 text-right pr-4">
                        <button
                          onClick={() => handleDeleteSaleRecord(r.id)}
                          className="text-slate-300 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-4 animate-in fade-in">
          <DateFilterBar filter={statsFilter} setFilter={setStatsFilter} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-teal-600 text-white p-8 rounded-[2rem] shadow-xl flex flex-col justify-between relative overflow-hidden">
              <BarChart3
                className="absolute -right-8 -bottom-8 text-teal-500 opacity-20"
                size={180}
              />
              <div className="relative z-10">
                <p className="text-teal-100 text-xs font-black uppercase mb-2 tracking-widest">
                  该时段净利润
                </p>
                <p className="text-5xl font-black tabular-nums">
                  {formatMoney(stats.profit)}
                </p>
              </div>
              <div className="mt-12 pt-6 border-t border-teal-500/30 flex justify-between text-xs font-black relative z-10">
                <div>营收额: {formatMoney(stats.revenue)}</div>
                <div>制作: {stats.count} 次</div>
              </div>
            </div>
            <div className="md:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h4 className="font-black text-slate-800 mb-6 flex items-center gap-3 text-xl">
                <PieChart size={24} className="text-teal-500" /> 产能精细汇总
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(stats.produced).map(([name, sizes]) =>
                  Object.entries(sizes).map(([size, data]) => (
                    <div
                      key={`${name}-${size}`}
                      className="border-2 border-slate-50 rounded-2xl p-4 bg-slate-50/20 flex justify-between items-center group hover:border-teal-200 transition-all"
                    >
                      <div>
                        <p className="font-black text-slate-800 text-sm">
                          {name}
                        </p>
                        <span className="text-[10px] font-black uppercase text-slate-400 bg-white px-2 py-0.5 rounded-full border mt-1 inline-block">
                          {size}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          折合整圆
                        </p>
                        <p className="text-2xl font-black text-teal-600 tabular-nums">
                          {data.equivalent.toFixed(1)}{' '}
                          <span className="text-xs font-normal">圆</span>
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Data Management Tab */}
      {activeTab === 'data' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <h3 className="text-lg font-black text-slate-800 mb-2">
              数据备份与恢复
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              您的所有数据都存储在本地浏览器中。请定期导出备份，以免清理缓存导致数据丢失。
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleExportData}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg"
              >
                <Download size={18} /> 导出备份 (.json)
              </button>
              <label className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 cursor-pointer transition-colors">
                <Upload size={18} /> 导入恢复
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportData}
                  accept=".json"
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Action Dialog (Custom UI) */}
      {actionDialog.isOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in-95 border border-slate-100">
            <h3 className="text-xl font-black mb-6 text-slate-800 flex items-center gap-2">
              {actionDialog.type === 'sell' ? (
                <DollarSign className="text-green-500" />
              ) : (
                <Ban className="text-red-500" />
              )}
              {actionDialog.type === 'sell' ? '确认售出' : '报废处理'}
            </h3>
            <div className="space-y-6 mb-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">
                  数量 ({actionDialog.product?.unit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={actionForm.quantity}
                    onChange={(e) =>
                      setActionForm({ ...actionForm, quantity: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-black text-lg text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                  {actionDialog.type === 'discard' && (
                    <span className="absolute right-4 top-4 text-[10px] text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle size={10} /> 自动填入剩余
                    </span>
                  )}
                </div>
              </div>
              {actionDialog.type === 'sell' ? (
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">
                    出售单价 (元)
                  </label>
                  <input
                    type="number"
                    value={actionForm.price}
                    onChange={(e) =>
                      setActionForm({ ...actionForm, price: e.target.value })
                    }
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-xl font-black text-lg text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                  <div
                    className={`mt-2 text-xs font-bold flex items-center gap-1 ${
                      parseFloat(actionForm.quantity) >
                      actionDialog.product?.quantity
                        ? 'text-red-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {parseFloat(actionForm.quantity) >
                    actionDialog.product?.quantity ? (
                      <XCircle size={12} />
                    ) : (
                      <Info size={12} />
                    )}
                    当前库存: {actionDialog.product?.quantity}
                    {parseFloat(actionForm.quantity) >
                      actionDialog.product?.quantity && ' (库存不足)'}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-bold flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  注意：报废操作将直接计入成本损耗，这会减少您的净利润，且操作不可逆。
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActionDialog({ isOpen: false })}
                className="flex-1 py-3.5 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleActionSubmit}
                className={`flex-1 py-3.5 text-white rounded-xl font-black shadow-lg transition-transform active:scale-95 ${
                  actionDialog.type === 'sell'
                    ? 'bg-green-600 shadow-green-200'
                    : 'bg-red-600 shadow-red-200'
                }`}
              >
                确认执行
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border animate-in zoom-in-95">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-slate-800">
              <AlertCircle className="text-red-500" /> 确认操作
            </h3>
            <p className="text-sm text-slate-500 font-bold mb-6">
              {confirmDialog.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDialog({ isOpen: false })}
                className="px-4 py-2 text-slate-400 font-bold hover:bg-slate-50 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold shadow-lg hover:bg-red-700 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BakingApp;
