---
title: "SpringCloud"
date: "2026-03-10"
tags: ["SpringCloud", "微服务"]
personality: "guide"
description: "SpringCloud 微服务框架学习"
---

## 0.1 组件

传统：
1. Eureka: 注册中心
2. Ribbon/LoadBalancer: 负载均衡
3. Feign：远程调用
4. Hystrix：服务熔断
5. Zuul/Gateway : 网关

Alibaba：
1. Nacos：注册、配置中心
2. Ribbon/LoadBalancer: 负载均衡
3. Dubbo: 远程调用
4. Sentinel：服务熔断
5. Gateway : 网关

![image.png](http://img.fcs.cloudns.ch/pics/20260310011717116.png)

![image.png](http://img.fcs.cloudns.ch/pics/20260310000932277.png)

## 0.2 服务注册和发现

常见的注册中心：**eureka、nocas、zookeeper**

![image.png|525](http://img.fcs.cloudns.ch/pics/20260310002658672.png)

1. 服务注册：服务提供者需要把自己的信息注册到 eureka，由 eureka 来保存这些信息，比如服务名称、ip、端口等等
2. 服务发现：消费者向 eureka 拉取服务列表信息，如果服务提供者有集群，则消费者会利用负载均衡算法，选择一个发起调用
3. 服务监控：服务提供者会每隔 30 秒向 eureka 发送心跳，报告健康状态，如果 eureka 服务 90 秒没接收到心跳，从 eureka 中剔除

两者区别：

> Nacos，服务注册和发现同时支持推拉两种方式更新数据，服务监控分为临时实例（心跳模式）和非临时实例（主动检测），支持配置中心。
> Nacos 集群默认采用 AP 方式，当集群中存在非临时实例时，采用 CP 模式；Eureka 采用 AP 方式

![image.png|550](http://img.fcs.cloudns.ch/pics/20260310003804291.png)

## 0.3 负载均衡

当存在服务供给者存在多个服务实例时，消费者如何选择一个目标实例进行调用，保证负载均衡。

### 0.3.1 Ribbon Vs Spring Cloud LoadBalancer 策略对比

| 策略名称       | Ribbon（已维护）                                            | Spring Cloud LoadBalancer（推荐）                                              |
| ---------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| **轮询**     | `RoundRobinRule`                                       | `RoundRobinLoadBalancer`（默认）                                               |
| **随机**     | `RandomRule`                                           | `RandomLoadBalancer`                                                       |
| **重试**     | `RetryRule`                                            | 需结合 Spring Retry 实现                                                        |
| **响应时间加权** | `WeightedResponseTimeRule`                             | 需自定义                                                                       |
| **最低并发**   | `BestAvailableRule`                                    | 需自定义                                                                       |
| **可用性过滤**  | `AvailabilityFilteringRule`                            | 需自定义                                                                       |
| **区域感知**   | `ZoneAvoidanceRule`（默认）                                | 可通过 `ZonePreferenceServiceInstanceListSupplier` 实现                         |
| **自定义策略**  | 实现 `IRule` 接口，注册为 Bean                                  | 实现 `ReactorServiceInstanceLoadBalancer` 接口                                 |
| **配置方式**   | 服务粒度：`<clientName>.ribbon.NFLoadBalancerRuleClassName` | 全局/服务粒度：`spring.cloud.loadbalancer.configurations` 或 `@LoadBalancerClient` |

## 0.4 服务雪崩

“服务雪崩”指的是：一个下游服务出故障或变得很慢，引起其上游调用者大量阻塞、资源耗尽，进而层层传导，导致整条调用链乃至整个系统都不可用的连锁失败效应。

![image.png](http://img.fcs.cloudns.ch/pics/20260310011644952.png)

- **服务雪崩**：微服务调用链中某个服务故障，引发级联失败，导致整个系统大面积不可用——这是我们要避免的“灾难场景”。
- **服务限流**：控制 QPS / 并发数，超过就拒绝或排队。提前控制进入系统的流量，防止“被自己人打死”。。
- **服务降级**：在资源不足或依赖故障时，主动/被动放弃非核心业务或返回兜底结果，保证核心业务可用。
- **服务熔断**：当下游服务错误/慢调用达到阈值时，自动“切断调用”，直接走降级逻辑，防止故障蔓延。
- **Sentinel**：阿里开源的“流量防卫兵”，在新版 Spring Cloud（特别是 Spring Cloud Alibaba）中，用来统一实现限流、熔断、降级、系统保护等，是解决雪崩问题的核心组件之一。
下面分开说清楚，并顺带提一下和 Spring Cloud Circuit Breaker / Resilience4j 的关系。

> 限流是“预防针”，熔断是“急救手术”，降级是“康复期的保守治疗”。

### 0.4.1 服务限流

目的：并发的确大（突发流量）；防止用户恶意刷接口

提前控制进入系统的流量，防止“被自己人打死”。它和熔断、降级不是同一层面的东西：限流是流量入口的“限速器”，熔断是故障时的“保险丝”，降级是出问题后的“兜底方案”。

方式：

Tomcat：可以设置最大连接数
Nginx：漏桶算法
网关: 令牌桶算法
自定义拦截器

1. 先来介绍业务，什么情况下去做限流，需要说明QPS具体多少
	- 我们当时有一个项目集中考试任务，到了考试开始时间就会大量并发用户请求考试，QPS最高可以达到10000，平时100-500之间，为了应对突发流量，需要做限流
	- 常规限流，为了防止恶意攻击，保护系统正常运行，我们当时系统能够承受最大的QPS是多少（压测结果）
2. nginx限流
	- 控制速率（突发流量），使用的漏桶算法来实现过滤，让请求以固定的速率处理请求，可以应对突发流量
	- 控制并发数，限制单个ip的链接数和并发链接的总数
3. 网关限流
	- 在spring cloud gateway中支持局部过滤器RequestRateLimiter来做限流，使用的是令牌桶算法
	- 可以根据ip或路径进行限流，可以设置每秒填充平均速率，和令牌桶总容量
#### 0.4.1.1 Nginx 限流

**控制速率** (突发流量)

```nginx
http {
	limit_req_zone $binary_remote_addr zone=serviceiRateLimit:10m rate=10r/s
	server {
		listen		80;
		server_name localhost;
		location / {
		limit_req_zone = serviceiRateLimit burst=20 nodelay;
		proxy_pass http://targetserver;
		}
	}
}
```

- 语法: `limit_req_zone key zone rate`
- key: 定义限流对象，`binary_remote_addr` 就是一种 key，基于客户端 ip 限流
- Zone：定义共享存储区来存储访问信息，10m 可以存储 16w ip 地址访问信息
- Rate：最大访问速率，`rate=10r/s` 表示每秒最多请求 10 个请求
- burst=20：相当于桶的大小
- Nodelay：快速处理

![image.png|450](http://img.fcs.cloudns.ch/pics/20260310222452105.png)

**控制并发连接数**

```nginx
http {
	limit_conn_zone $binary_remote_addr zone=perip:10m;
	limit_conn_zone $server_name zone=perserver:10m;
	server {
		listen		80;
		server_name localhost;
		location / {
			...
			limit_conn perip 20;
			limit_conn perserver 100;
			proxy_pass http://targetserver;
			}
		}
}
```

- limit_conn perip 20：对应的 key 是$binary_remote_addr，表示限制单个IP同时最多能持有20个连接。
- limit_conn perserver 100：对应的 key 是 $server_name，表示虚拟主机(server) 同时能处理并发连接的总数。

#### 0.4.1.2 网关限流

![image.png|500](http://img.fcs.cloudns.ch/pics/20260310224347732.png)

yml配置文件中，微服务路由设置添加局部过滤器RequestRateLimiter

```yaml
-   id: gateway-consumer
	uri: 1b://GATEWAY-CONSUMER
	predicates:
	- Path=/order/**
	filters:
	  - name: RequestRateLimiter
		args:
			#使用SpEL从容器中获取对象
			key-resolver: '#{@pathkeyResolver}" 
			#令牌桶每秒填充平均速率
			redis-rate-limiter.replenishRate: 1
			#令牌桶的上限
			redis-rate-limiter.burstCapacity: 3
```

- key-resolver：定义限流对象（ip、路径、参数），需代码实现，使用spel表达式
- replenishRate：令牌桶每秒填充平均速率。
- burstCapacity：令牌桶总容量。

### 0.4.2 服务降级

服务降级是服务自我保护的一种方式，或者保护下游服务的一种方式，用于确保服务不会受请求突增影响变得不可用，确保服务不会崩溃

![image.png|525](http://img.fcs.cloudns.ch/pics/20260310190641162.png)

### 0.4.3 服务熔断

Hystrix 熔断机制，用于监控微服务调用情况，默认是关闭的，如果需要开启需要在引 I 导类上添加注解：@EnableCircuitBreaker 如果检测到**10 秒内请求的失败率超过 50%**，就触发熔断机制。之后每隔**5 秒**重新尝试请求微服务，如果微服务不能响应，继续走熔断机制。如果微服务可达，则关闭熔断机制，恢复正常请求

![image.png](http://img.fcs.cloudns.ch/pics/20260310191043150.png)

### 0.4.4 Sentinel

- 阿里开源的 **“分布式系统流量防卫兵”**，核心能力：**流量控制 + 熔断降级 + 系统自适应保护**。
- 已成为 Spring Cloud Alibaba 生态中事实标准的流量治理组件。
- **资源（Resource）**：被保护的对象（接口、方法、一段代码）。
- **规则（Rule）**：定义保护策略，如：
  - 流量控制规则：QPS 阈值、并发线程数阈值。
  - 熔断降级规则：异常比例、异常数、慢调用比例。
  - 系统保护规则：CPU 使用率、系统 Load1、入口 QPS 等。

### 0.4.5 Sentinel 与 Hystrix / Resilience4j 的简单对比

| 维度 | Hystrix | Sentinel | Resilience4j |
|------|---------|----------|--------------|
| 状态 | 已停止维护 | 阿里持续维护 | 社区维护 |
| 功能 | 熔断 + 线程隔离 | 限流 + 熔断 + 降级 + 系统保护 + 热点参数 | 熔断 + 限流 + 重试 + 舱壁等 |
| 配置方式 | 硬编码/配置为主 | 控制台 + 配置中心动态推送 | 注解 + YAML |
| 监控 | 需集成 Turbine | 内置 Dashboard，秒级监控 | 需集成 Micrometer/Actuator |
| 适用场景 | 老项目维护 | Spring Cloud Alibaba 新项目 | 纯 Spring Cloud 新项目 |

**一句话：**
- 如果你用的是 **Spring Cloud Alibaba**，推荐直接用 **Sentinel**。
- 如果你用的是 **Spring Cloud 官方栈**，可以用 **Spring Cloud Circuit Breaker + Resilience4j**。
---

### 0.4.6 实战层面：如何用 Sentinel 防雪崩（简单示例）

以 Spring Cloud Alibaba Sentinel 为例：
1. 引入依赖并配置控制台地址。
2. 在关键接口上加 `@SentinelResource`，指定 `blockHandler`。
3. 在 Sentinel 控制台为该资源配置：
   - **限流规则**：如 `QPS = 100`。
   - **熔断降级规则**：如异常比例 ≥ 50% 持续 5 秒则熔断 10 秒。
4. 当：
   - 流量突增 → 限流触发 → 返回 “系统繁忙”。
   - 下游服务大量报错 → 熔断触发 → 返回兜底数据。
5. 这样即使某个依赖挂掉，也不会把你的服务拖垮，避免雪崩。
---

### 0.4.7 小结

- **雪崩**：是问题现象；原因是级联依赖 + 无保护。
- **降级**：是兜底手段，保证核心业务可用。
- **熔断**：是保护机制，在下游故障时“切断调用”，触发降级。
- **Sentinel**：在新版 Spring Cloud 中，是实现限流、熔断、降级、系统保护的一站式解决方案，是防雪崩的核心组件之一。
如果你愿意，我可以按你的 Spring Cloud 版本（比如 Spring Cloud Alibaba 202x.x）给一份更具体的“从零接入 Sentinel”的最小示例配置。

## 0.5 服务监控

- 问题定位
- 性能分析
- 服务关系
- 服务告警

`监控工具`：
Springboot-admin
prometheus+Grafana 
zipkin 
skywalking

### 0.5.1 Skywalking

一个分布式系统的应用程序性能监控工具（Application Performance Managment），提供了完善的链路追踪能力，apache 的顶级项目（前华为产品经理吴晟主导开源）

我们项目中采用的 skywalking 进行监控的
1. skywalking 主要可以监控接口、服务、物理实例的一些状态。特别是在压测的时候可以看到众多服务中哪些服务和接口比较慢，我们可以针对性的分析和优化。
2. 我们还在 skywalking 设置了告警规则，特别是在项目上线以后，如果报错，我们分别设置了可以给相关负责人发短信和发邮件，第一时间知道项目的 bug 情况，第一时间修复。

![image.png](http://img.fcs.cloudns.ch/pics/20260310211808030.png)
![image.png](http://img.fcs.cloudns.ch/pics/20260310211951963.png)

### 0.5.2 Arthas

Arthas = 阿里开源的 Java 线上“诊断瑞士军刀”，主要用来：
在不重启应用、不加日志、不修改代码的前提下，在线排查各种 JVM / 线程 / 类 / 方法调用 / 性能问题。

![image.png](http://img.fcs.cloudns.ch/pics/20260310214856978.png)
