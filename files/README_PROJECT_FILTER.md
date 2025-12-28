# Plansale项目过滤交互功能说明

## 📁 修改的文件

1. **index_modified.html** - 修改后的首页HTML
2. **style_modified.css** - 修改后的样式表
3. **script_modified.js** - 修改后的JavaScript文件

## ✨ 实现的功能

### 🖥️ Desktop（桌面端）交互

当用户使用鼠标时：

1. **鼠标悬停（Hover）**: 
   - 鼠标移到"Website"按钮 → 下方只显示Website项目
   - 鼠标移到"Commercial Signs"按钮 → 下方只显示Commercial Signs项目
   - 鼠标移到其他按钮 → 显示对应类别的项目
   - **不会跳转页面**，只是预览切换

2. **鼠标点击（Click）**:
   - 点击任何按钮 → **直接跳转**到 `projects.html#对应类别`

### 📱 Mobile（移动端）交互

当用户使用触摸屏时：

1. **第一次触碰**:
   - 触碰"Website"按钮 → 下方切换显示Website项目
   - **不会跳转**，只是预览切换

2. **第二次触碰同一个按钮**:
   - 再次触碰"Website"按钮 → **跳转**到 `projects.html#website`

3. **触碰不同按钮**:
   - 第一次触碰"Website" → 显示Website项目
   - 触碰"Commercial Signs" → 显示Commercial Signs项目（不跳转）
   - 再次触碰"Commercial Signs" → 跳转到projects.html#signs

## 🔧 如何使用

### 方法1：完全替换（推荐）

```bash
# 1. 备份你的原文件
mv index.html index.html.backup
mv assets/css/style.css assets/css/style.css.backup
mv assets/js/script.js assets/js/script.js.backup

# 2. 使用修改后的文件
cp index_modified.html index.html
cp style_modified.css assets/css/style.css
cp script_modified.js assets/js/script.js
```

### 方法2：重命名使用

如果你想保留原文件，可以这样：

```bash
# 直接重命名修改后的文件
mv index_modified.html index.html
mv style_modified.css style.css
mv script_modified.js script.js
```

## 📝 主要修改内容

### 1. HTML修改（index.html）

#### 修改前：
```html
<ul class="filter-list">
  <li>
    <button class="filter-btn active" onclick="location.href='projects.html#website'">Website</button>
  </li>
  <!-- ... -->
</ul>

<ul class="grid-list">
  <li>
    <div class="project-card">...</div>
  </li>
  <!-- ... -->
</ul>
```

#### 修改后：
```html
<ul class="filter-list" data-project-filters>
  <li>
    <a class="filter-btn active" data-category="website" href="projects.html#website">Website</a>
  </li>
  <!-- ... -->
</ul>

<ul class="grid-list" data-project-grid>
  <li data-category="website">
    <div class="project-card">...</div>
  </li>
  <!-- ... -->
</ul>
```

**关键变化：**
- `<button>` 改为 `<a>` 标签（保留跳转能力）
- 添加 `data-category` 属性标记类别
- 添加 `data-project-filters` 和 `data-project-grid` 用于JS选择器
- 移除 `onclick` 内联事件

### 2. CSS修改（style.css）

```css
.filter-btn {
  /* 原有样式... */
  text-decoration: none;      /* 新增：去除下划线 */
  display: inline-block;      /* 新增：块级显示 */
  cursor: pointer;            /* 新增：鼠标手型 */
  border: none;               /* 新增：去除边框 */
  background: none;           /* 新增：透明背景 */
}
```

### 3. JavaScript修改（script.js）

在文件末尾添加了约60行代码，实现：
- 检测设备类型（桌面/移动）
- Desktop hover预览功能
- Mobile双击跳转功能
- 显示/隐藏项目卡片

## 🎯 技术实现原理

### 设备检测
```javascript
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
```
- `pointer: coarse` = 触摸屏设备（手机、平板）
- `pointer: fine` = 精确指针设备（鼠标）

### Desktop交互
```javascript
// Hover时切换预览
a.addEventListener('mouseenter', () => {
  setActive(a.dataset.category);
});

// Click时允许默认跳转（不阻止）
a.addEventListener('click', (e) => {
  // 不调用 e.preventDefault()，允许跳转
});
```

### Mobile交互
```javascript
a.addEventListener('click', (e) => {
  if (activeCat !== cat) {
    e.preventDefault();  // 第一次点击：阻止跳转
    setActive(cat);      // 切换预览
  }
  // 第二次点击相同按钮：不阻止，允许跳转
});
```

## ✅ 测试建议

### Desktop测试
1. 打开浏览器开发者工具（F12）
2. 鼠标悬停在不同按钮上，观察项目切换
3. 点击按钮，确认跳转到正确页面

### Mobile测试
1. 使用浏览器的设备模拟器（F12 → 设备工具栏）
2. 或在真实手机上测试
3. 第一次触碰：应该只切换预览
4. 第二次触碰：应该跳转页面

## 🐛 故障排除

### 如果功能不工作：

1. **检查控制台**
   - 打开浏览器控制台（F12 → Console）
   - 应该看到："Project filter system initialized."
   - 切换时应该看到："Project filter switched to: xxx"

2. **检查文件路径**
   - 确保script.js正确加载
   - 确保style.css正确加载

3. **检查HTML结构**
   - 确保 `data-category` 属性存在
   - 确保 `data-project-filters` 和 `data-project-grid` 存在

## 📞 需要帮助？

如果遇到问题：
1. 检查浏览器控制台错误信息
2. 确认所有文件都已正确替换
3. 清除浏览器缓存后重试

---

**版本**: 1.0  
**日期**: 2025-01-27  
**兼容性**: 现代浏览器（Chrome, Firefox, Safari, Edge）
