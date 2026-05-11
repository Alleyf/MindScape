---
title: "Spring"
date: "2026-03-08"
tags: ["Spring"]
personality: "guide"
description: "Spring 框架学习笔记"
---

## 0.1 Bean

### 0.1.1 线程安全性

严格来说：非线程安全
Spring bean 并没有可变的状态(比如 Service 类和 DAO 类)，所以在某种程度上说 Spring 的单例 bean 是线程安全的。

![image.png|500](http://img.fcs.cloudns.ch/pics/20260308000828000.png)

> Spring 框架中有一个@Scope 注解，默认的值就是 singleton，单例的。
> 因为一般在 spring 的 bean 的中都是注入无状态的对象，没有线程安全问题，如果在 bean 中定义了可修改的成员变量，是要考虑线程安全问题的，可以使用多例或者加锁来解决

### 0.1.2 生命周期

![image.png](http://img.fcs.cloudns.ch/pics/20260308135138344.png)

1. 通过 BeanDefinition 获取 bean 的定义信息
2. 调用构造函数实例化 bean（反射实例化对象）
3. bean 的依赖注入（bean 注入和非非 bean 属性的注入）
4. 处理 Aware 接口(BeanNameAware #getBeanName 、BeanFactoryAware #getBeanFactory 、ApplicationContextAware #getApplicationContext )
5. Bean 的后置处理器 BeanPostProcessor-前置（PostProcessorBeforeInitialization）
6. 初始化方法(InitializingBean、init-method)
7. Bean 的后置处理器 BeanPostProcessor-后置（PostProcessorAfterInitialization）
8. 销毁 bean（先执行@PreDestroy 注解的方法，再标记 bean 销毁，并不是立即销毁）

## 0.2 AOP

AOP 称为面向切面编程，用于将那些与业务无关，但却对多个对象产生影响的公共行为和逻辑，抽取并封装为一个可重用的模块，这个模块被命名为“切面”（Aspect），减少系统中的重复代码，降低了模块间的耦合度，同时提高了系统的可维护性。

常见场景：
记录操作日志
缓存处理
Spring 中内置的事务处理

![image.png](http://img.fcs.cloudns.ch/pics/20260308002129182.png)

## 0.3 Spring 事务

其本质是通过 AOP 功能，对方法前后进行拦截，在执行方法之前开启事务，在执行完目标方法之后根据执行情况提交或者回滚事务。

Spring 支持编程式事务管理和声明式事务管理两种方式。
- 编程式事务控制：需使用 TransactionTemplate/TransactionManager 来进行实现，对业务代码有侵入性，项目中很少使用
- 声明式事务管理：声明式事务管理建立在 AOP 之上的。其本质是通过 AOP 功能，对方法前后进行拦截，将事务处理的功能编织到拦截的方法中，也就是在目标方法开始之前加入一个事务，在执行完目标方法之后根据执行情况提交或者回滚事务。

![image.png](http://img.fcs.cloudns.ch/pics/20260308002705258.png)

### 0.3.1 事务失效

- 异常捕获处理
- 抛出检查异常
- 非 public 方法（无法被 AOP 动态代理）
- 内部调用（无法被 AOP 动态代理）
- 异步

## 0.4 循环引用

1. 循环依赖：循环依赖其实就是循环引 I 用，也就是两个或两个以上的 bean 互相持有对方，最终形成闭环。比如 A 依赖于 B，B 依赖于 A
2. 循环依赖在 spring 中是允许存在，spring 框架依据三级缓存已经解决了大部分的循环依赖
	- 一级缓存：单例池，缓存已经经历了完整的生命周期，已经初始化完成的 bean 对象
	- 二级缓存：缓存早期的 bean 对象（生命周期还没走完）
	- 三级缓存：缓存的是 objectFactory，表示对象工厂，用来创建某个对象的

![image.png](http://img.fcs.cloudns.ch/pics/20260308141220143.png)

### 0.4.1 三级缓存解决循环依赖

```java
Spring解决循环依赖是通过三级缓存，对应的三级缓存如下所示：
//单实例对象注册器
public class DefaultSingletonBeanRegistry extends SimpleAliasRegistry implements SingletonBeanRegistry {
private static final int SUPPRESSED_EXCEPTIONS_LIMIT = 100;
private final Map<String, Object> singletonObjects = new ConcurrentHashMap(256); 一级缓存
private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap(16); 三级缓存
private final Map<String, Object> earlySingletonObjects = new ConcurrentHashMap(16); 二级缓存
```

| 缓存名称 | 源码名称          | 作用                                                         |
| -------- | ----------------- | ------------------------------------------------------------ |
| 一级缓存 | singletonObjects  | 单例池，缓存已经经历了完整的生命周期，已经初始化完成的 bean 对象 |
| 二级缓存 | earlySingletonObjects | 缓存早期的 bean 对象（生命周期还没走完）                         |
| 三级缓存 | singletonFactories | 缓存的是 ObjectFactory，表示对象工厂，用来创建某个对象的       |

### 0.4.2 二级缓存流程图

> 无法解决代理对象的循环依赖问题

![](https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20260308152936966.png)

### 0.4.3 三级缓存流程图

![](https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20260308151857287.png)

> 三级缓存可以解决**初始化中的循环依赖**，无法解决**构造器中的循环依赖**；
> 构造器循环依赖可以通过 **@Lazy 懒/延迟加载** 解决，属性 Bean 被使用时再创建。

## 0.5 SpringMVC

### 0.5.1 执行流程

#### 0.5.1.1 视图阶段（老 I 日 JSP 等）

四个核心组件： `DispatcherServlet（前端控制器）、 HandlerMapping（处理器映射器）、 HandlerAdapter (处理器适配器)、ViewReslover（视图解析器）`

1. 用户发送出请求到前端控制器 DispatcherServlet
2. DispatcherServlet 收到请求调用 HandlerMapping（处理器映射器）
3. HandlerMapping 找到具体的处理器，生成处理器对象及处理器拦截器(如果有)，再一起返回给 DispatcherServlet。
4. DispatcherServlet 调用 HandlerAdapter (处理器适配器)
5. HandlerAdapter 经过适配调用具体的处理器(Handler/Controller)
6. Controller 执行完成返回 ModelAndView 对象
7. HandlerAdapter 将 Controller 执行结果 ModelAndView 返回给 DispatcherServlet
8. DispatcherServlet 将 ModelAndView 传给 ViewReslover（视图解析器）
9. ViewReslover 解析后返回具体 View（视图）
10. DispatcherServlet 根据 View 进行渲染视图（即将模型数据填充至视图中）
11. DispatcherServlet 响应用户

![237|800](https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20260308163029940.png)

#### 0.5.1.2 前后端分离阶段（接口开发，异步）

> 去除了 ViewReslover（视图解析器），经过转换直接返回 json 响应

1. 用户发送出请求到前端控制器 DispatcherServlet
2. DispatcherServlet 收到请求调用 HandlerMapping（处理器映射器）
3. HandlerMapping 找到具体的处理器，生成处理器对象及处理器拦截器(如果有)，再一起返回给 DispatcherServlet.
4. DispatcherServlet 调用 HandlerAdapter （处理器适配器）
5. HandlerAdapter 经过适配调用具体的处理器（Handler/Controller）
6. 方法上添加了@ResponseBody
7. 通过 HttpMessageConverter 来返回结果转换为 JSON 并响应

![](https://raw.githubusercontent.com/Alleyf/PictureMap/main/blog/20260308163706891.png)

## 0.6 SpringBoot自动配置

1. 在SpringBoot项目中的引l导类上有一个注解@SpringBootApplication，这个注解是对三个注解进行了封装，分别是：
**@SpringBootConfiguration**
**@EnableAutoConfiguration**
**@ComponentScan**
2. 其中@EnableAutoConfiguration是实现自动化配置的核心注解。该注解通过 *@lmport注解导入对应的配置选择器* 。内部就是读取了该项目和该项目引用的Jar包的的classpath路径下*META-INF/spring.factories*文件中的所配置的类的全类名。在这些配置类中所定义的Bean会根据条件注解所指定的条件来决定是否需要将其导入到Spring容器中。
3. 条件判断会有像 *@ConditionalOnClass* 这样的注解，判断是否有对应的class文件，如果有则加载该类，把这个配置类的所有的Bean放入spring容器中使用。

> **AutoConfigurationImportSelector** 是 Spring Boot “约定优于配置”理念的实现者。它负责扫描、筛选并最终导入满足条件的配置类，从而极大地简化了 Spring 应用的初始搭建和开发过程。

@`SpringBootApplication`
	- @`SpringBootConfiguration`：该注解与@Configuration注解作用相同，用来声明当前也是一个配置类。
	- @`ComponentScan`：组件扫描，默认扫描当前引导类所在包及其子包。
	- @`EnableAutoConfiguration`：SpringBoot实现自动化配置的核心注解。
		- @Import({`AutoConfigurationImportSelector`.class})：根据一定的条件Condition条件注解的条件决定是否导入`META-INF/spring.factories`到Spring容器中

## 0.7 Spring-SpringMVC-SpringBoot框架常见注解

### 0.7.1 Spring常见注解

| 注解 | 说明 |
|------|------|
| @Component、@Controller、@Service、@Repository | 使用在类上用于实例化Bean |
| @Autowired | 使用在字段上用于根据类型依赖注入 |
| @Qualifier | 结合@Autowired一起使用用于根据名称进行依赖注入 |
| @Scope | 标注Bean的作用范围 |
| @Configuration | 指定当前类是一个Spring配置类，当创建容器时会从该类上加载注解 |
| @ComponentScan | 用于指定Spring在初始化容器时要扫描的包 |
| @Bean | 使用在方法上，标注将该方法的返回值存储到Spring容器中 |
| @Import | 使用@import导入的类会被Spring加载到Ioc容器中 |
| @Aspect、@Before、@After、@Around、@Pointcut | 用于切面编程（AOP） |

### 0.7.2 SpringMVC常见注解

| 注解 | 说明 |
|------|------|
| @RequestMapping | 用于映射请求路径，可以定义在类上和方法上。用于类上，则表示类中的所有的方法都是以该地址作为父路径 |
| @RequestBody | 注解实现接收http请求的json数据，将json转换为java对象 |
| @RequestMapping | 指定请求参数的名称 |
| @PathVariable | 从请求路径下中获取请求参数(/user/{id})，传递给方法的形式参数 |
| @ResponseBody | 注解实现将controller方法返回对象转化为json对象响应给客户端 |
| @RequestHeader | 获取指定的请求头数据 |
| @RestController | @Controller + @ResponseBody |

### 0.7.3 Springboot常见注解

| 注解 | 说明 |
|------|------|
| @SpringBootConfiguration | 组合了 @Configuration 注解，实现配置文件的功能 |
| @EnableAutoConfiguration | 打开自动配置的功能，也可以关闭某个自动配置的选项 |
| @ComponentScan | Spring组件扫描 |