export type Locale = 'en' | 'ms' | 'zh'

export const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ms', label: 'BM' },
  { code: 'zh', label: '中文' },
]

export const localeTags: Record<Locale, string> = {
  en: 'en-MY',
  ms: 'ms-MY',
  zh: 'zh-CN',
}

type Dict = {
  brandName: string
  eyebrow: string
  tagline: string
  liveGold: string
  updated: string
  delayed: string
  bnmLine: string
  chartTitle: string
  chartSubtitle: string
  chartRangeAria: string
  range1d: string
  range1w: string
  range1m: string
  range2m: string
  chartLoading: string
  chartEmpty: string
  chartError: string
  liveError: string
  purchaseTitle: string
  purchaseSubtitle: string
  editPurchaseTitle: string
  editPurchaseSubtitle: string
  gramsLabel: string
  gramsPlaceholder: string
  dateLabel: string
  priceLabel: string
  pricePlaceholder: string
  priceAutoLoading: string
  priceAutoExact: string
  priceAutoNearest: string
  priceAutoMissing: string
  priceAutoEditable: string
  useLivePrice: string
  addPurchase: string
  savePurchase: string
  cancelEdit: string
  errGrams: string
  errDate: string
  errPrice: string
  holdingsTitle: string
  holdingsSubtitle: string
  purchasesListTitle: string
  purchasesListSubtitle: string
  portfolioPnl: string
  addToTrack: string
  totalGold: string
  cost: string
  valueNow: string
  emptyHoldings: string
  boughtAt: string
  edit: string
  editAria: string
  remove: string
  removeAria: string
  footer: string
  langAria: string
}

export const translations: Record<Locale, Dict> = {
  en: {
    brandName: 'EmasKu',
    eyebrow: 'Malaysia · BNM Kijang Emas',
    tagline: 'Track every gram you buy. See what it is worth today in ringgit.',
    liveGold: 'Gold price (mid)',
    updated: 'Updated',
    delayed: 'delayed',
    bnmLine: 'BNM Kijang Emas (1 oz): buy {buy} · sell {sell} · {date}',
    chartTitle: 'Gold price in MYR',
    chartSubtitle: 'BNM Kijang Emas · RM per gram (mid)',
    chartRangeAria: 'Chart time range',
    range1d: '1D',
    range1w: '1W',
    range1m: '1M',
    range2m: '2M',
    chartLoading: 'Loading chart…',
    chartEmpty: 'No chart data available right now.',
    chartError: 'Could not load the gold chart right now.',
    liveError: 'Could not load live gold price. Try refresh in a moment.',
    purchaseTitle: 'Log a purchase',
    purchaseSubtitle: 'Grams, date, and the RM/g you paid.',
    editPurchaseTitle: 'Edit purchase',
    editPurchaseSubtitle: 'Update grams, date, or the RM/g you paid.',
    gramsLabel: 'Grams bought',
    gramsPlaceholder: 'e.g. 10',
    dateLabel: 'Purchase date',
    priceLabel: 'Gold price that day (RM/g)',
    pricePlaceholder: 'e.g. 520.00',
    priceAutoLoading: 'Fetching BNM price for this date…',
    priceAutoExact: 'Auto-filled from BNM for {date}. You can still edit.',
    priceAutoNearest:
      'No BNM price on {requested}. Used nearest day {date}. You can still edit.',
    priceAutoMissing: 'No BNM price found for this date. Enter it manually.',
    priceAutoEditable: 'Custom price — you can keep editing.',
    useLivePrice: "Use today's live price ({price})",
    addPurchase: 'Add to MyEmas',
    savePurchase: 'Save changes',
    cancelEdit: 'Cancel',
    errGrams: 'Enter grams greater than 0.',
    errDate: 'Choose the purchase date.',
    errPrice: 'Enter the gold price (RM/g) on that day.',
    holdingsTitle: 'Your gold',
    holdingsSubtitle: 'Current value vs what you paid.',
    purchasesListTitle: 'Your purchases',
    purchasesListSubtitle: 'Edit or remove any gold buy.',
    portfolioPnl: 'Portfolio P/L',
    addToTrack: 'Add a purchase to track earnings',
    totalGold: 'Total gold',
    cost: 'Cost',
    valueNow: 'Value now',
    emptyHoldings: 'No purchases yet. Log your first gold buy above.',
    boughtAt: 'Bought {date} @ {price}/g',
    edit: 'Edit',
    editAria: 'Edit holding of {grams} grams',
    remove: 'Remove',
    removeAria: 'Remove holding of {grams} grams',
    footer:
      'Prices from Bank Negara Malaysia Kijang Emas (official). MyEmas stores your purchases only on this device.',
    langAria: 'Choose language',
  },
  ms: {
    brandName: 'EmasKu',
    eyebrow: 'Malaysia · BNM Kijang Emas',
    tagline: 'Rekod setiap gram emas anda. Lihat nilai semasa dalam ringgit.',
    liveGold: 'Harga emas (purata)',
    updated: 'Dikemas kini',
    delayed: 'tertunda',
    bnmLine: 'BNM Kijang Emas (1 oz): beli {buy} · jual {sell} · {date}',
    chartTitle: 'Harga emas dalam MYR',
    chartSubtitle: 'BNM Kijang Emas · RM segram (purata)',
    chartRangeAria: 'Julat masa carta',
    range1d: '1D',
    range1w: '1W',
    range1m: '1M',
    range2m: '2M',
    chartLoading: 'Memuatkan carta…',
    chartEmpty: 'Tiada data carta buat masa ini.',
    chartError: 'Carta emas tidak dapat dimuatkan sekarang.',
    liveError: 'Harga emas semasa tidak dapat dimuatkan. Cuba semula sebentar.',
    purchaseTitle: 'Rekod pembelian',
    purchaseSubtitle: 'Gram, tarikh, dan harga RM/g yang dibayar.',
    editPurchaseTitle: 'Edit pembelian',
    editPurchaseSubtitle: 'Kemaskini gram, tarikh, atau harga RM/g.',
    gramsLabel: 'Gram dibeli',
    gramsPlaceholder: 'cth. 10',
    dateLabel: 'Tarikh pembelian',
    priceLabel: 'Harga emas pada hari itu (RM/g)',
    pricePlaceholder: 'cth. 520.00',
    priceAutoLoading: 'Mendapatkan harga BNM untuk tarikh ini…',
    priceAutoExact: 'Diisi automatik dari BNM untuk {date}. Anda masih boleh edit.',
    priceAutoNearest:
      'Tiada harga BNM pada {requested}. Guna hari terdekat {date}. Anda masih boleh edit.',
    priceAutoMissing: 'Tiada harga BNM untuk tarikh ini. Masukkan secara manual.',
    priceAutoEditable: 'Harga tersuai — anda boleh terus edit.',
    useLivePrice: 'Guna harga semasa hari ini ({price})',
    addPurchase: 'Tambah ke MyEmas',
    savePurchase: 'Simpan perubahan',
    cancelEdit: 'Batal',
    errGrams: 'Masukkan gram lebih daripada 0.',
    errDate: 'Pilih tarikh pembelian.',
    errPrice: 'Masukkan harga emas (RM/g) pada hari tersebut.',
    holdingsTitle: 'Emas anda',
    holdingsSubtitle: 'Nilai semasa berbanding kos anda.',
    purchasesListTitle: 'Senarai pembelian',
    purchasesListSubtitle: 'Edit atau buang mana-mana belian emas.',
    portfolioPnl: 'Untung / rugi portfolio',
    addToTrack: 'Tambah pembelian untuk jejak keuntungan',
    totalGold: 'Jumlah emas',
    cost: 'Kos',
    valueNow: 'Nilai sekarang',
    emptyHoldings: 'Belum ada pembelian. Rekod beli emas pertama di atas.',
    boughtAt: 'Beli {date} @ {price}/g',
    edit: 'Edit',
    editAria: 'Edit pegangan {grams} gram',
    remove: 'Buang',
    removeAria: 'Buang pegangan {grams} gram',
    footer:
      'Harga daripada Bank Negara Malaysia Kijang Emas (rasmi). MyEmas simpan pembelian anda hanya pada peranti ini.',
    langAria: 'Pilih bahasa',
  },
  zh: {
    brandName: '寻金记',
    eyebrow: '马来西亚 · 国家银行 Kijang Emas',
    tagline: '记录每一克黄金，查看今天的令吉市值与盈亏。',
    liveGold: '金价（中间价）',
    updated: '更新于',
    delayed: '延迟',
    bnmLine: '国家银行 Kijang Emas（1盎司）：买入 {buy} · 卖出 {sell} · {date}',
    chartTitle: '令吉金价走势',
    chartSubtitle: '国家银行 Kijang Emas · 每克令吉（中间价）',
    chartRangeAria: '图表时间范围',
    range1d: '1D',
    range1w: '1W',
    range1m: '1M',
    range2m: '2M',
    chartLoading: '正在加载图表…',
    chartEmpty: '暂无图表数据。',
    chartError: '暂时无法加载金价图表。',
    liveError: '无法加载实时金价，请稍后再试。',
    purchaseTitle: '记录买入',
    purchaseSubtitle: '克数、日期与当日买入价（令吉/克）。',
    editPurchaseTitle: '编辑买入',
    editPurchaseSubtitle: '修改克数、日期或买入价（令吉/克）。',
    gramsLabel: '买入克数',
    gramsPlaceholder: '例如 10',
    dateLabel: '买入日期',
    priceLabel: '当日金价（令吉/克）',
    pricePlaceholder: '例如 520.00',
    priceAutoLoading: '正在获取该日国家银行金价…',
    priceAutoExact: '已按 {date} 国家银行价格自动填入，仍可修改。',
    priceAutoNearest: '{requested} 无报价，已使用最近交易日 {date}，仍可修改。',
    priceAutoMissing: '找不到该日国家银行金价，请手动输入。',
    priceAutoEditable: '自定义价格 — 可继续修改。',
    useLivePrice: '使用今日实时价（{price}）',
    addPurchase: '添加到寻金记',
    savePurchase: '保存更改',
    cancelEdit: '取消',
    errGrams: '请输入大于 0 的克数。',
    errDate: '请选择买入日期。',
    errPrice: '请输入当日金价（令吉/克）。',
    holdingsTitle: '我的黄金',
    holdingsSubtitle: '当前市值对比买入成本。',
    purchasesListTitle: '买入记录',
    purchasesListSubtitle: '可编辑或删除任意买入。',
    portfolioPnl: '投资组合盈亏',
    addToTrack: '添加买入记录以追踪收益',
    totalGold: '总克数',
    cost: '成本',
    valueNow: '现值',
    emptyHoldings: '暂无买入记录。请先在上方添加。',
    boughtAt: '买入 {date} @ {price}/克',
    edit: '编辑',
    editAria: '编辑 {grams} 克持仓',
    remove: '删除',
    removeAria: '删除 {grams} 克持仓',
    footer:
      '价格来自马来西亚国家银行 Kijang Emas（官方）。寻金记仅将购买记录保存在本设备。',
    langAria: '选择语言',
  },
}

export function t(
  locale: Locale,
  key: keyof Dict,
  vars?: Record<string, string | number>,
): string {
  let text = translations[locale][key]
  if (!vars) return text
  for (const [name, value] of Object.entries(vars)) {
    text = text.replaceAll(`{${name}}`, String(value))
  }
  return text
}
