/**
***随机节点类
***作成日期            2014/7/18
*/

(function () {
    var Class = ZYDesign.Class;
    // 随机节点类 继承自工具节点类
    Class.RandomNode = (function () {
        /**
            随机节点类
        */
        function RandomNode() {
            if (!(this instanceof RandomNode)) {
                return;
            }
            // 继承自工具节点类
            Class.ToolNode.call(this);
            // 背景色
            this.backgroundColor = "#aa4843";
            // 随机开始口
            this.randomStart = new ZYDesign.Class.RandomStartConnector(this);
        }

        // 继承自工具节点类
        Class.inheritPrototype(Class.ToolNode, RandomNode);

        // 节点类型
        RandomNode.prototype.type = ZYDesign.Enum.NODETYPE.RANDOM;
        // 节点类型整数
        RandomNode.prototype.typeInt = 12;
        // 分类类型
        RandomNode.prototype.categoryType = 3;
        // 随机开始文字位置X坐标
        RandomNode.prototype.randomStartTextX = 15;
        // 随机开始文字位置Y坐标
        RandomNode.prototype.randomStartTextY = 66 + 13;
        // 随机开始圆圈位置X坐标
        RandomNode.prototype.randomStartCircleX = 0;
        // 随机开始圆圈位置Y坐标
        RandomNode.prototype.randomStartCircleY = 61 + 13;
        // 类型列表字段
        RandomNode.prototype.typeListKey = "randomNodes";
        // 类型名
        RandomNode.prototype.typeName = "随机节点";
        // 类型图标
        RandomNode.prototype.typeIcon = "";

        /**
            初始化
            @nodeData 源数据
            @x 指定的X坐标,没有指定则使用nodeData中的值
            @x 指定的Y坐标,没有指定则使用nodeData中的值
        */
        RandomNode.prototype.init = function (nodeData, x, y) {
            // 先调用父类同名方法
            RandomNode.base.init.call(this, nodeData, x, y);
            // 生成随机开始点
            this.initRandomStart();
        }

        /**
            生成随机输入点
        */
        RandomNode.prototype.initRandomStart = function () {
            // 连接点名字
            this.randomStart.text = "随机开始";
            if (this.originData.randomStart.uuid) {
                this.randomStart.outputId = this.originData.randomStart.uuid;
            }
        };

        /**
            根据ID搜索连接点
            @connectorId 连接点ID
        */
        RandomNode.prototype.searchConnectorById = function (connectorId) {
            // 输出点
            if (this.output.outputId == connectorId) {
                return this.output;
            }
            // 输入点
            if (this.input.inputId == connectorId) {
                return this.input;
            }

            // 循环输入点
            if (this.randomStart.outputId == connectorId) {
                return this.randomStart;
            }
            return false;
        }

        /**
            导出该节点为Json数据
            @questionairId 所属问卷ID
            @jsonHolder 用来收集数据的对象
        */
        RandomNode.prototype.exportJson = function (questionairId, jsonHolder) {
            // 调用父类同名方法
            RandomNode.base.exportJson.call(this, questionairId, jsonHolder);
            // 随机开始
            jsonHolder.randomStart = {
                index: -5,
                uuid: this.randomStart.outputId,
            }
        }

        /**
            复制节点信息
            @jsonHolder 副本数据存储对象
            @diffX 副本位置X偏移量
            @diffY 副本位置Y偏移量
        */
        RandomNode.prototype.cloneNodeJson = function (jsonHolder, diffX, diffY) {
            RandomNode.base.cloneNodeJson.call(this, jsonHolder, diffX, diffY);
            // 添加函数名
            jsonHolder.addFnKey = "addRandomNode";
            // 随即开始
            jsonHolder.randomStart = {
                text: "随机开始",
            };
        }

        /**
            节点合法性检查,特殊属性检查
            子类节点有特殊检查需求时重写该方法
            @result 存储检查结果的对象
        */
        RandomNode.prototype.validate = function (result) {
            // 没有传出结果存储对象则初始化
            if (!result) {
                result = {
                    isValid: true,
                    message: Prompt.QSNRD_Valid // Prompt.QSNRD_Valid
                }
            }
            // 先调用父类方法进行检查
            RandomNode.base.validate.call(this, result);
            // 父类中已检查出错误
            if (!result.isValid) {
                return result;
            }
            // 没有随机组
            if (this.randomStart.dests.length == 0) {
                result.isValid = false;
                result.message = Prompt.QSNRD_InvalidNoRandomGroup; // Prompt.QSNRD_InvalidNoRandomGroup
                return result;
            }
            return result;
        }

        /**
            获得后续节点
            搜索成功后会返回一个对象包含两个属性,
            第一个是后续节点列表,第二个是需要继续往下搜索的节点列表
        */
        RandomNode.prototype.searchNextNodesByOrder = function () {

            var resultList = [],
                seedList = [],
                dests = this.randomStart.dests;
            // 要先把所有随机组节点按顺序找出来
            for (var i = 0; i < dests.length; i++) {
                // 开始一个随机组
                var node = dests[i].parent,     // 该随机组带头节点
                    results = [node],           // 该节点作为为第一个后续节点
                    seeds = [node],             // 该节点作为为往后搜索的第一个种子节点
                    start = 0,                  // 需要搜索的种子范围开始索引
                    end = seeds.length          // 需要搜索的种子范围结束索引
                do {
                    // 循环当前的种子列表,往后搜
                    for (var j = start; j < end; j++) {
                        var seed = seeds[j];
                        var result = seed.searchNextNodesByOrder();
                        // 将结果加入总结果列表
                        for (var k = 0; k < result.resultList.length; k++) {
                            var rs = result.resultList[k];
                            // 总结果列表中没有该节点
                            if (results.indexOf(rs) < 0) {
                                results.push(rs);
                            }
                        }
                        // 将种子加入到种子列表中
                        for (var k = 0; k < result.seedList.length; k++) {
                            var sd = result.seedList[k];
                            // 种子列表中不包含该种子
                            if (seeds.indexOf(sd) < 0) {
                                seeds.push(sd);
                            }
                        }
                    }
                    // 更新要搜索的种子范围
                    start = end;
                    end = seeds.length;
                } while (end > start)
                // 将该随机组搜到的节点都计入到结果列表中
                resultList = resultList.concat(results);
            }

            // 找完随机组再找总输出口
            var outputDest = this.output.dest;
            if (outputDest) {
                var nextNode = outputDest.parent;
                resultList.push(nextNode);
                seedList.push(nextNode);
            }

            return {
                resultList: resultList,
                seedList: seedList
            }
        }
        return RandomNode;
    })();
})();


