---
date: "2026-05-11"
title: "前端 学习清单"
tags: ["frontend", "learning", "html", "css", "javascript", "react"]
personality: "未来主义者"
description: "一份面向前端开发的学习清单"
---


# **React + Ant Design 前端速成**
为了短期上手 React + Ant Design (antd) 项目，可以参考以下以任务为导向的速成学习路线。该路线专注于快速实践和核心技能的掌握，避免过度深究细节，适合前端基础薄弱的学习者。

![前端学习路线图](/images/frontend-learning-checklist.svg)

## **一、学习 React 基础知识**
+ **目标**：了解 React 的开发流程。
+ **内容**：
    - 掌握 React 的组件化思想（函数组件 vs 类组件）。
    - 熟悉 JSX 语法，理解如何将数据渲染为 UI 。
    - 学习使用 `useState` 和 `useEffect` 进行状态管理和副作用处理。
    - 了解 React 的生命周期（类组件）和 Hook 的使用（函数组件）。
+ **实践任务**：
    - 创建一个简单的 React 应用，展示动态计数器（加减按钮）。
    - 实现一个 Todo List 应用，支持添加、删除和标记完成任务。
+ **推荐资源**：
    - [快速入门 – React 中文文档](https://react.docschina.org/) 。

## **二、学习 Ant Design 基本使用**
+ **目标**：熟练使用 antd 组件库构建界面。
+ **内容**：
    - 安装并引入 antd，熟悉其样式和主题配置方法。
    - 使用 antd 提供的基础组件（如 Button、Input、Table、Form 等）构建常见 UI 元素。
    - 学习如何通过 `Modal`、`Drawer`、`Message` 等组件实现交互效果。
    - 掌握 antd 的表单校验和提交逻辑。
+ **实践任务**：
    - 构建一个用户信息管理页面，包含输入框、下拉选择器、表格展示等功能。
    - 使用 antd 的 Form 组件实现登录表单，并添加表单校验逻辑。
+ **推荐资源**：
    - [Ant Design 组件总览](https://ant.design/components/overview/) 。

## **三、学习 React 路由和状态管理**
+ **目标**：掌握 React 单页应用的核心功能。
+ **内容**：
    - 学习使用 `react-router-dom` 实现路由跳转和嵌套路由。
    - 理解全局状态管理的基本需求，初步接触 Redux 或 Context API。
    - 学习如何在 React 中发起 HTTP 请求（如使用 `axios` 或 `fetch`）。
+ **实践任务**：
    - 构建一个带有导航栏的多页面应用，例如首页、详情页和设置页。
    - 在页面间传递参数并动态加载数据（如从 mock 数据源获取用户列表）。
+ **推荐资源**：
    - [React 官方文档](https://react.docschina.org/) 。
    - [Ant Design Pro](https://pro.ant.design/) （可作为高级参考）。

## **四、学习构建工具与项目结构**
+ **目标**：熟悉 React 项目的创建和开发流程。
+ **内容**：
    - 学习使用 Create React App 快速搭建 React 项目 。
    - 了解 Vite、Parcel 等现代构建工具的使用 。
    - 熟悉 React 项目的目录结构和模块化开发方式。
    - 学习如何配置 ESLint、Prettier 等代码规范工具。
+ **实践任务**：
    - 使用 Create React App 创建一个新项目，并集成 antd。
    - 配置开发环境，实现热更新和调试功能。
+ **推荐资源**：
    - [创建一个新的 React 应用](https://react.docschina.org/docs/create-a-new-application.html) 。

---

## **五、实战项目：构建一个完整的 CRUD 应用**
+ **目标**：综合运用所学知识，完成一个实际项目。
+ **内容**：
    - 使用 React + antd 开发一个具有增删改查功能的管理系统（如商品管理、用户管理等）。
    - 集成 Mock 数据服务或调用真实后端接口（如 Spring Boot 后端）。
    - 实现分页、搜索、排序等常见功能。
    - 使用 Git 进行版本控制，提交代码到 GitHub。
+ **推荐资源**：
    - [Ant Design Pro](https://pro.ant.design/) （提供开箱即用的模板和业务组件）。

通过以上五步，你可以在短期内快速上手 React + Ant Design 项目，具备独立开发简单企业级应用的能力。每一步都强调动手实践，结合官方文档和社区资源，确保学习效率最大化 。

---

# 常规学习路线
## 一、前端入门
1. 开发工具：
    - 浏览器：
        * 熟悉Chrome和Edge浏览器的使用
        * 掌握查看网页布局和调试等信息的方法
    - 编辑器：
        * 熟悉VSCode的使用
2. HTML：
    - 描述：用于定义一个网页结构的基本技术
    - 学习目标：
        * 了解基本语法
        * 知道怎么查看浏览器支持
    - 资源：
        * [使用 HTML 组织网站内容 - 学习 Web 开发 | MDN](https://developer.mozilla.org/zh-CN/docs/Learn/HTML)
        * [HTML 教程 | 菜鸟教程](https://www.runoob.com/html/html-tutorial.html)
3. CSS：
    - 描述：层叠样式表，可以在HTML的基础上设计风格和布局。
    - 学习目标：
        * 熟悉基本语法、在HTML中的引入方式
        * 熟悉选择器的使用
        * 熟悉各种属性
        * 掌握内联元素、盒子模型、浮动布局、定位等布局相关知识
    - 资源：
        * [CSS - 学习 Web 开发 | MDN](https://developer.mozilla.org/zh-CN/docs/Learn/CSS)
        * [CSS 教程 | 菜鸟教程](https://www.runoob.com/css/css-tutorial.html)
        * [CSS flex布局（弹性布局/弹性盒子）](http://c.biancheng.net/css3/flex.html)
4. JavaScript（重要）:
    - 描述：具有函数优先的轻量级，解释型编程语言，使用广泛。
    - 学习目标：
        * 熟悉基本语法、数据类型转换
        * 熟悉函数、对象的概念
        * 熟悉DOM API、BOM API
        * 掌握ES6+特性，如作用域、解构赋值、对象扩展和新增方法、异步编程等
    - 资源：
        * [JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
        * [现代 JavaScript 教程](https://zh.javascript.info/)（推荐）
        * 《JavaScript权威指南（第七版）》、《JavaScript高级程序设计（第四版）》（工具书，可以根据需要翻阅）
        * 阮一峰《ECMAScript 6 入门》（必看）

## 二、基础巩固
1. 学习完前端三件套后可以独立完成一个网站的demo
2. 掌握浏览器控制台调试技巧
3. 掌握git版本控制
4. 了解IDEA，Android Studio的简单使用
5. 了解如何配置开发环境（结合后面的学习）

## 三、前端进阶
1. JQuery：
    - 描述：jQuery 是一个 JavaScript 库，可以简化JavaScript编程。了解即可，不需要花费太多时间。
    - 学习目标：
        * 了解jQuery的基本语法
        * 了解jQuery AJAX
    - 资源：
        * [jQuery 教程 | 菜鸟教程](https://www.runoob.com/jquery/jquery-tutorial.html)
2. React（重要）:
    - 描述：React是一个JavaScript框架，可以帮助我们快速开发大型前端应用，是实验室前端的主要技术之一需要重点掌握。
    - 学习目标：
        * 了解基本语法，目录结构、熟练掌握JSX的编写
        * 了解类组件与函数组件的区别
        * 掌握组件生命周期、嵌套组件、组件通信
        * 掌握组件库（Ant design 3/4、Ant design pro）
        * 掌握状态管理库（Redux、Dva（主要））
        * 掌握 React框架（Umi 2/3，包括状态管理、路由管理等）
        * 了解 TypeScript 的使用（作为补充）
    - 资源：
        * [快速入门 – React](https://react.docschina.org/learn)（推荐）
        * [react16.8+的生命周期_月迷津渡丶的博客-CSDN博客](https://blog.csdn.net/oYueMiJinDu/article/details/110357795)（实验室主要版本为16.8和17.0，注意版本之间的区别）
        * [【译】build your own react - 知识搬运工 - 掘金](https://juejin.cn/post/6884968140892176397)（比较进阶的内容，关注底层原理，可以先简单了解）
3. Dart + Flutter：
    - 描述：近年来比较流行的跨端开发框架，可用来开发Web、Android、ios、客户端应用，目前也是实验室主要技术之一。
    - 学习目标：
        * 熟悉Dart的基本语法
        * 掌握Widget，包括基本概念、接口、四棵树、有状态和无状态Widget
        * 熟悉状态管理、包管理、资源管理、Flutter应用调试
        * 掌握Flutter组件布局
    - 资源：
        * [第二版序 | 《Flutter实战·第二版》](https://book.flutterchina.club/)（推荐）
        * [Button RaisedButton FlatButton OutlineButton IconButton 按钮 Flutter 实战 | Flutter | 老孟](http://laomengit.com/guide/widgets/Button.html)
        * Dart 官网以及 Flutter 官网
4. 其他（可选择学习）
    - Java基础、Struts2 + JSP、数据库等

## 四、其他资源分享
1. 书籍
    - 《Head First HTML与CSS》
    - 《JavaScript 语言精粹》
    - 《JavaScript忍者秘籍》
    - 《图解HTTP》
    - 《Dart语言实战》
2. 代码仓库
    - [https://github.com/ascoders/weekly](https://github.com/ascoders/weekly)
    - [https://github.com/li-jia-nan/Learning-notes](https://github.com/li-jia-nan/Learning-notes)
    - [https://github.com/stephentian/33-js-concepts](https://github.com/stephentian/33-js-concepts)
    - [https://github.com/7kms/react-illustration-series](https://github.com/7kms/react-illustration-series)
3. 网站
    - github
    - 稀土掘金
    - Stack Overflow
    - [https://www.code-nav.cn/](https://www.code-nav.cn/)

## 五、总结
前端内容庞杂，基本看了就忘，所以多看多写，巩固基础，不懂就查，熟能生巧。培养代码逻辑，养成良好的思维方式。

