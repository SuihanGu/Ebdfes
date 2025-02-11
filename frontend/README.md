## UI Components Documentation
- [iView UI Plus Guide](https://www.iviewui.com/view-ui-plus/guide/introduce)

## Virtual Table Component Documentation
- [vxe-table (v3) Installation Guide](https://vxetable.cn/v3/#/table/start/install)

## Git Push with ESLint Error
- If you encounter ESLint errors when pushing to Git, remove the `pre-commit` file located in the `.git` directory in the root of your project.

## Getting Started

### Install Dependencies
```bash
npm install
```
## Development
- npm run dev
## Build
- npm run build
## Auto Adjust to Screen Size
```bash
function refreshRem(){
    var width = docEl.getBoundingClientRect().width;
    if (width / dpr > 540) {
        // Uncomment to limit width to 540 * dpr
        // width = 540 * dpr;
        width = width * dpr;
    }
    var rem = width / 10;
    docEl.style.fontSize = rem + 'px';
    flexible.rem = win.rem = rem;
}
```
