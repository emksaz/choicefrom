

/**
    操作记录管理模块
*/
angular.module("recordManager", [])

/**
   注册一个服务 
*/
.factory("recordManager", [function () {
    return new (function () {
        var lastCompareId = 0;
        function OperationModel(data) {
            if (!(this instanceof OperationModel)) {
                return;
            }
            // 索引
            this.index = -1;
            // 比较ID,不需要比较的都为-1
            this.compareId = -1;
            // 描述
            this.descript = data.descript || "无描述";
            // 是否排他检查
            this.exclusive = data.exclusive || false;
            // 需要排他检查
            if (this.exclusive) {
                this.compareId = lastCompareId;
            }
            // 参数
            this.param = data.param || {};
            // 有自定义重做函数则使用自定义的重做函数
            if(data.redo instanceof Function){
                this.redo = data.redo;
            }
            // 有自定义撤销函数则使用自定义的撤销函数
            if(data.undo instanceof Function){
                this.undo = data.undo;
            }

            // 有自定义的合并函数则使用自定义的合并函数
            if (data.merge instanceof Function) {
                this.merge = data.merge;
            }

            // 有自定义的合并函数则使用自定义的合并函数
            if (data.compare instanceof Function) {
                this.compare = data.compare;
            }
            
            // 原型函数
            if (!OperationModel.prototype.undo) {

                /**
                    默认的撤销函数
                    每个注册的地方可自定义撤销行为
                */
                OperationModel.prototype.undo = function () {
                    var param = this.param
                    if (this.param.obj) {
                        this.param.obj[this.param.key] = this.param.oldValue
                    }
                }
                /**
                    默认的重做函数
                    每个注册的地方可自定义重做行为
                */
                OperationModel.prototype.redo = function () {
                    var param = this.param
                    if (this.param.obj) {
                        this.param.obj[this.param.key] = this.param.newValue
                    }
                }

                /**
                    默认的比较函数
                    用于比较某个记录是否和自己的行为一致,常用于需要记录限流的场合,
                    比如文本框连续输入100个字母,则会尝试记录100次,增大开销且无意义,
                    相同则可以配合merge方法合并记录而不是新增记录,这样就可以连续输入100次,只记录1次,
                    每个注册的地方可自定义比较行为
                    @record 元数据
                */
                OperationModel.prototype.compare = function (record) {
                    return this.compareId == record.compareId;
                }

                /**
                    默认的合并函数
                    用于将另一条记录合并到自身
                    一般配合compare方法使用,compare返回true,则可以合并
                    每个注册的地方可自定义合并行为
                    @record 元数据
                */
                OperationModel.prototype.merge = function (record) {
                    if (this.compareId != record.compareId) {
                        return;
                    }
                    this.param.newValue = record.param.newValue;
                }
            }
        }

        

        // 记录列表
        this.recordList = [],
        this.currIndex = -1;

        // 是否正在执行重做或撤销任务
        this.engaging = false;

        /**
            升级
        */
        this.upgrade = function () {
            if (this.recordList.length == 0) {
                return;
            }
            lastCompareId++;
            // 当前正处于末尾
            if (this.currIndex == this.recordList.length - 1) {
                var last = this.recordList[this.currIndex];
                // 检查末尾记录是否为无效的变化记录
                if((last.param.oldValue == last.param.newValue)
                    && last.compareId > 0) {
                    // 是无效的末尾记录则丢掉
                    this.recordList.pop();
                    // 维护当前索引
                    this.currIndex--;
                }
            }
        }

        /**
            注册
            @data 注册数据
            数据格式:
            data:{
                descript:"这里写你的描述内容"     // 整堆这次记录的描述
                exclusive:false;是否排他检查      // 诸如文本框内容更改等持续持续变化是可以设为true节流
                param:{                           // 具体的内容参数
                    obj:obj,                      // *参与变化的对象
                    key:key,                      // *参与变化的对象的属性
                    oldValue:oldValue,            // *参与变化的对象的属性原值
                    newValue:newValue,            // *参与变化的对象的属性新值
                    ....                          ....
                    ....                          ....
                    other:other                   // 其他函数
                },
                undo:function(){},                 // 自定义撤销函数 
                redo:function(){},                 // 自定义重做函数
                compare:function(){},              // 自定义比较函数
                merge:function(){},                // 自定义合并函数
            }
            compare与merge函数只有exclusive为true时才会被调用,且每个功能函数都已有一个默认的函数,如配置了自定的
            函数则会使用自定义的,否则使用默认的.
            默认模式:使用默认模式时会调用管理器自带的功能函数,但是使用该模式时带有*的参数必须严格按照说明格式配置
                     未自定义配置的功能函数将会走默认模式,如有该情况,需确保带*参数已完整配置
            自定模式:完整配置功能函数则会使用自定模式,此时参数可以任意配置,只要你自己需要即可.
        */
        this.register = function (data) {
            // 功能未开放
            if (!ZYDesign.Config.optrRecordEnable) {
                return;
            }
            // 当前正在执行任务
            if (this.engaging) {
                return;
            }

            var oprt = new OperationModel(data);
            // 当前索引之后的记录清除
            if (this.recordList.length > this.currIndex + 1) {
                this.recordList = this.recordList.slice(0, this.currIndex + 1);
            }
            var last = this.recordList[this.currIndex];
            // 需要排他且是相同时段的相同行为
            if (oprt.exclusive && last && last.compare(oprt)) {
                // 合并记录
                last.merge(oprt);
                // 不排他或不同
            } else {
                // 添加记录
                oprt.index = this.recordList.length;
                // 将新纪录推到末尾
                this.recordList.push(oprt);
                // 当前索引提升
                this.currIndex++;
            }
            
        }

        /**
            清除操作记录
        */
        this.clear = function () {
            this.recordList = [];
            this.currIndex = -1;
        }

        /**
            撤销
        */
        this.undo = function () {
            // 找不到老记录
            if (this.currIndex < 0) {
                return false;
            }
            // 标记正在执行任务
            this.engaging = true;
            var record = this.recordList[this.currIndex];
            // 撤销该次记录
            record.undo();
            // 当前索引跌落
            this.currIndex--;
            // 标记任务结束
            this.engaging = false;
            return true;
        }

        /**
            重做
        */
        this.redo = function () {
            // 找不到新纪录
            if (this.currIndex == this.recordList.length - 1) {
                return false;
            }
            // 标记正在执行任务
            this.engaging = true;
            // 当前索引提升
            this.currIndex++;
            var record = this.recordList[this.currIndex];
            // 重做该次记录
            record.redo();
            // 标记任务结束
            this.engaging = false;
            return true;
        }

        /**
            undo的可用性
        */
        this.isUndoEnabled = function () {
            if (this.currIndex < 0) {
                return false;
            }
            return true;
        }

        /**
            redo的可用性
        */
        this.isRedoEnabled = function () {
            if (this.currIndex == this.recordList.length - 1) {
                return false;
            }
            return true;
        }

        ZYDesign.RecordManager = this;
    })();

}])

