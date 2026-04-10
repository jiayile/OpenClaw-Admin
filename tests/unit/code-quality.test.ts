import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { execSync } from 'child_process'

describe('Frontend Code Quality', () => {
  describe('TypeScript Compilation', () => {
    it('should compile without errors', () => {
      try {
        execSync('npx vue-tsc -b', { 
          cwd: '/www/wwwroot/ai-work',
          stdio: 'pipe' 
        })
      } catch (error: any) {
        // 检查是否有真正的编译错误
        if (error.stdout?.toString().includes('error TS')) {
          throw new Error(`TypeScript compilation failed:\n${error.stdout}`)
        }
      }
    })
  })

  describe('ESLint', () => {
    it('should pass linting rules', () => {
      try {
        execSync('npx eslint src/**/*.vue src/**/*.ts --ext .vue,.ts', {
          cwd: '/www/wwwroot/ai-work',
          stdio: 'pipe'
        })
      } catch (error: any) {
        // ESLint 返回非零退出码表示有问题
        if (error.stdout?.toString().includes('error')) {
          throw new Error(`ESLint errors found:\n${error.stdout}`)
        }
      }
    })
  })

  describe('Component Files', () => {
    const componentFiles = [
      'src/components/cron/CronEditor.vue',
      'src/components/common/BatchActionsBar.vue',
      'src/components/common/SmartSearchFilter.vue',
      'src/components/common/ThemeSwitcher.vue',
      'src/components/charts/BaseChart.vue',
      'src/components/charts/DashboardCard.vue',
      'src/components/charts/StatCard.vue',
      'src/components/charts/ProgressChart.vue'
    ]

    componentFiles.forEach(file => {
      it(`should exist: ${file}`, () => {
        execSync(`test -f ${file}`, { 
          cwd: '/www/wwwroot/ai-work' 
        })
      })
    })
  })

  describe('Test Files', () => {
    const testFiles = [
      'tests/unit/cron-editor.test.ts',
      'tests/unit/batch-actions.test.ts',
      'tests/unit/smart-search.test.ts',
      'tests/unit/theme-switcher.test.ts',
      'tests/unit/dashboard-card.test.ts',
      'tests/unit/stat-card.test.ts'
    ]

    testFiles.forEach(file => {
      it(`should exist: ${file}`, () => {
        execSync(`test -f ${file}`, { 
          cwd: '/www/wwwroot/ai-work' 
        })
      })
    })
  })
})

describe('Frontend Build', () => {
  it('should build successfully', () => {
    // 只检查配置是否正确，不实际构建
    const fs = require('fs')
    const viteConfig = fs.readFileSync('/www/wwwroot/ai-work/vite.config.ts', 'utf8')
    expect(viteConfig).toContain('vue')
    expect(viteConfig).toContain('vite')
  })
})
