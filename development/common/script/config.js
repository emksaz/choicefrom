


/**
     提示信息字典表,所有的提升信息都放在此处统一管理,
   */
var Prompt = {
    /**********************▼通用提示▼**********************/
    /**********************▲通用提示▲**********************/


    /**********************▼非通用提示▼**********************/
    /**********************▲非通用提示▲**********************/



    /**********************▼ ▼**********************/
    
    SaveOK:"保存成功。",//10001
    SubmitOK:"提交成功。",//10002
    FreezeOK:"冻结成功。",//10003
    NotFindSearchResult:"没有找到查询结果。",//10004
    FirstSaveQues:"请先保存您的问卷。",//10005
    RecommendedBrowser:"建议使用Chrome或Safari浏览器进行问卷设计。",//10006
    PublishOK:"您的问卷已成功发布，系统将对问卷内容进行审核，审核时间为3个工作日，审核完毕后系统将自动提醒您。",//10007
    OpenLocationService:"请在您终端的系统设置中打开“位置服务”后重新选择。",//10008
    LatestVersion:"当前版本已经是最新版本。",//10009

    ResetPassword:"成功重置密码。",//10011
    SendEmailPrompt:"验证激活码已发送到您的注册邮箱，请激活完成注册。如果五分钟之内还未收到邮件，请重新发送。",//10012
    NoLawChat:"发票{0}:  含有非法字符'|'或者';'，请修改后保存。",//10013
    NullOfVat:"您有未输入的发票编号。",//10014
    NotFoundFolder:"未找到文件夹。",//10015
    ChooseQues:"请先选择问卷。",//10016
    InputLoginPwd:"请在文本框内输入您的登录密码。",//10017
    InputCopyQuesTitle:"请输入问卷复制后新问卷的名称。",//10018
    InputOfflineReason:"请在文本框内输入问卷的下线原因。",//10019
    SetAutoLine1:"请先设置配额行。",//10020
    QuesTitleDoNotNull:"问卷标题不可为空，请输入问卷标题。",//10021
    QuesDescribeDoNotNull:"问卷简介不可为空，请输入问卷简介。",//10022
    QuesDescribeTooLong:"问卷简介内容过长，简介内容不多于300字。",//10023
    FolderNameDoNotNull:"文件夹名称不能为空，请输入文件夹名称。",//10024
    AutoColumnDoNotNull:"配额列不可以为空。",//10025
    AutoLine1DoNotNull:"配额行不可以为空。",//10026
    RegisterSuccess:"请点击邮件中的激活链接。如果五分钟之内还未收到邮件，请重新发送。",//10027
    FolderNumReachedLimit:"文件夹数量已达上限，文件夹数量不能多于10个。",//10028
    DelSuccess:"删除成功。",//10029
    CancelPublishOK:"取消发布成功。",//10030
    DownAuditSubmit:"下线成功！",//10031
    QuesCreateSaveOK:"问卷创建成功。",//10032
    QuesDelOK:"问卷删除成功。",//10033
    QuesCopyOK:"问卷复制成功。",//10034
    ReleaseOK:"发布成功。",//10035



    LackOfAdjustmentBalance:"调整金额值不允许大于账户余额值。",//20001
    FinishedAudit:"该问卷已审核完毕，不能再次审核。请刷新页面获得最新数据。",//20002
    QuesNameRepeat: "问卷名称重复，请重新输入问卷名称。",//20003
    DownAudit_QuesDown:"该问卷已经下线。",//20004
    ComvatAuditCompletion:"该企业资质已经审核完毕，不能再次审核。请刷新页面获得最新数据。",//20005
    ComvatAudit_ComVat:"该问卷已经下线。",//20006
    ComvatDeleted:"该企业资质已经被删除。",//20007
    AgeRangeError:"年龄范围设置错误。",//20008
    UnableToAutomaticallySave:"无法自动保存，请检查浏览器设置或释放存储空间。",//20009
    NotAllowedToEdit:"该问卷不允许编辑。",//20010
    OutputAtATime:"该输出端只能输出一次。",//20011
    AllowAccessInputEndAndTheEnd :"输出线只允许接入输入端和循环结束端。",//20012
    NotAllowedAccessOwnInputAndOutput:"输出线不允许接入节点自身的输入、输出端。",//20013
    NotAllowedAccessPreviousInputEnd:"输出线不允许接入之前节点的输入端。",//20014
    UnableConnectLogicalNode:"开始节点输出端不能连接到逻辑节点输入端。",//20015
    NotAttachment:"该节点所有输出端都已输出。",//20016
    InputOrOutputMissing:"输入端或输出端连线缺失。",//20017
    InputPointLimit:"输入端只能与输出端、随机开始端与循环开始端连线。",//20018
    NotAccessSamePoint:"剩余或全部选项输出与该节点输出项不能接入同一个节点。",//20019
    AllOrOtherOutput:"多选题只能选择全部选项输出端进行输出。",//20020
    NotAllowedAccessAandomStartPoint:"循环题输出线不能接入随机题的随机开始端。",//20021
    NotAccessOtherAttachment:"循环题输入端已经接入多选题，并开启选项循环时，不能再接入其他输出连线。",//20022
    NotSupportRandom:"逻辑题、循环题暂不支持随机。",//20023
    UnableConnectMultipleRandomLines:"参与随机的题目不能连接到多个随机节点和参与多个随机。",//20024
    RandomOutputLimit:"参与随机的题目不能跳出本随机和输出到本随机外的题目中。",//20025
    LoopOutputLimit:"参与循环的题目不能跳出本循环和输出到本循环外的题目中。",//20026
    AccessOutput:"循环结束点只能连接到节点输出端。",//20027
    TwoLayersOfLoop:"最多只能支持两级循环嵌套。",//20028
    NotParticipateTwoLoops:"同一题目不能同时参与两个循环。",//20029
    UnableDebug:"无法开始调试，请确认已正确互联网连接。",//20030
    QuesSetTwoGroupsQuota:"一份问卷最多能设置2组配额。",//20031
    QuotaLineThreeConditions:"问卷配额行最多能设置3组条件。",//20032
    QuotaColumnThreeConditions:"问卷配额列最多能设置3组条件。",//20033
    NotAllowedChangeQuota:"当前问卷状态下不允许修改配额。",//20034
    NumberSmall:"修改后的问卷发行数量不能小于已发布的发行数量。",//20035
    NotAllowedResubmit:"当前问卷状态下，问卷不可以再次提交发布。",//20036
    LackOfBalance:"账户余额不足。",//20037
    ChooseViolations:"请选择具体违规项。",//20038
    SetTimeLimit:"请设定问卷的有效时限，有效时限外问卷将自动失效。",//20039
    ChooseCompany:"请点击选择公司企业。",//20040
    InputSearConditions:"请输入搜索条件。",//20041
    ChooseUser:"请点击选择用户。",//20042
    EditUserInfoError:"修改联系人信息错误。",//20043
    EditComInfoError:"修改公司信息错误。",//20044
    GetUserInfoError:"得到联系人基本信息错误。",//20045
    SendEmailError:"发送邮件错误。",//20046
    EditPasswordError:"修改密码错误。",//20047
    EditEmailError:"修改邮箱错误。",//20048
    GetEmailStateError:"获取邮箱状态错误。",//20049
    DelVatInfoError:"删除增票资质信息错误。",//20050
    SaveVatInfoError:"保存增票资质错误。",//20051
    SaveVatAdresError:"保存增票收票地址错误。",//20052
    GetVatInfoError:"获取增票资质信息错误。",//20053
    UserIDFormatError:"用户ID格式错误，无法修改！",//20054
    UserIDNoUseError:"用户ID无效，无法修改！",//20055
    LoginPasswordError:"登录密码不正确。",//20056
    PasswordAsSameError:"填写的新旧密码一致，无法修改！",//20057
    EmailAsSameError:"填写的新旧邮箱一致，无法修改！",//20058
    EmailExistsError:"本邮箱已存在，请更换注册邮箱！",//20059
    EmailUserIDError:"用户ID错误，无法获取邮箱状态！",//20060
    ZYEmailCode:"您好，本邮件是众研用户激活验证邮件。",//20061
    CheckUserInfoError:"查询用户注册邮箱信息出错，请稍后再试。",//20062
    ActivationError:"激活错误。",//20063
    EmailAlreadyActivation:"您的注册邮箱已经激活。",//20064
    ActivationSuccess:"激活成功。",//20065
    VerificationCodeError:"激活码出错或者过期。",//20066
    NoInfoError:"未查询到任何信息。",//20067
    UserNameExists:"本用户名已经被注册，请更换用户名。",//20068
    EmailNotUser:"本注册邮箱已经被使用，请更换邮箱。",//20069
    CompanyManager:"企业管理员。",//20070
    SaveFailedNotInfo:"未查询到用户信息，保存失败。",//20071
    DelCompanyVat:"该企业资质已被删除。",//20072
    ComVatAlreadyAudit:"该企业资质已经审核完毕，不能再次审核，请刷新页面获得最新数据。",//20073
    UserOrPwdError:"用户不存在或密码错误。",//20074
    IDErrorProhibitQuery:"ID格式错误，禁止查询。",//20075
    NoPermissionOperateQuestionnaire:"无问卷操作权限。",//20076
    ReleaseDateSmall:"问卷计划发布日期不能小于当前日期+3天。",//20077
    RoleNameRepeat:"该角色名称已存在。",//20078
    RoleNotExist:"该角色不存在。",//20079
    UserNameRepeat:"该用户名已存在。",//20080
    UserNotExist:"该用户不存在。",//20081
    CantThroughAudit:"有违规项，无法通过审核。",//20082
    SaveInformationFirstThenJumpPage:"请先保存信息，再跳转页面。",//20083
    AgreeTermsFirst:"请确认同意相关条款。",//20084
    ChooseValueList:"请选择值集名。",//20085
    MaximumCantLessThanMinimum:"最大值不能小于最小值。",//20086
    StateDoNotSearchData:"当前状态不可查看数据。",//20087
    DoNotCopy:"当前问卷不可复制。",//20088
    QuesDoNotSearchData:"当前问卷不可查看数据。",//20089
    QuesPicUploadSuccess:"问卷封面上传完成。",//20090
    QuesNotBelongUser:"问卷不属于当前用户。",//20091
    RefreshVerificationCode:"验证码错误或者过期，请刷新验证码。",//20092
    AfterModifyQuestionnairePublish:"已经有重名问卷发布在线，请修改您的问卷名后重新发布。",//20093
    MobileExists:"本手机号码已经被使用，请更换手机号码。",//20094



    QuesMoveOtherFolder:"删除文件夹不会删除其中的问卷，文件夹中的问卷将移入“我的文件夹”中。",//20100
    QuesMoveNewFolder:"请选择需要转入新文件夹的问卷。",//20101
    QuesDoNotDel:"当前问卷状态下，问卷不能被删除。",//20102
    QuesDoNotOffline:"当前问卷状态下，问卷不可以申请下线。",//20103
    QuesNotExist:"问卷不存在。",//20104
    QuesDoNotAddAutoLine:"当前问卷状态下，问卷不可以增加配额行。",//20105
    QuesDoNotDelAutoLine:"当前问卷状态下，问卷不可以删除配额行。",//20106
    QuesDoNotDelAutoGroup:"当前问卷状态下，问卷不可以删除配额组。",//20107
    QuesDoNotAddAutoGroup:"当前问卷状态下，问卷不可以增加配额组。",//20108
    QuesDoNotGenerateData:"当前问卷状态下，问卷不可以生成数据。",//20109
    QuesDoNotCancelPublish:"当前问卷状态下，问卷不可以取消发布。",//20110
    DoNotDownloadPermission:"您没有权限下载此调查的权限！",//20111
    AfterTheDownload:"该问卷还未结束，请在结束后下载数据！",//20112
    AutoInputPositiveInteger:"配额数值必须为正整数。",//20113
    Auto1AndAuto2NumInconsistent:"配额数量不一致。",//20114
    SetAutoLine1AndAutoColumn:"请先设置配额行和配额列。",//20115
    QuesAutoNotBeLessThanOneHundred:"问卷配额不得少于100。",//20116
    AutoLineCantSame:"不同配额行的条件不能相同。",//20117
    AutoLine1AndColumnCantSame:"配额行与配额列不能完全相同。",//20118
    AutoLine2AndColumnCantSame:"配额行与配额列不能完全相同。",//20119
    SameQuotaLineCantHaveSameSelectionProblem:"在同一配额行中不可以有相同甄别题。",//20120
    PublishDaySmall:"该问卷已发布，您只能调整时限，新设定的时限必须晚于原时限。",//20121
    QuotaNodeError:"配额引用的题发现错误，请修改配额的设置后再发布。",//20122
    NumberSmall1:"问卷发行数小于已经发布的数量。",//20123
    NumberSmall2:"调研时限不能小于已经发布的数量。",//20124
    CollDoNotOffline:"当前收集器状态下，收集器不可以下线。",//20125
    CollDoNotCancel:"当前收集器状态下，收集器不可以取消发布。",//20126
    CollNotExist: "收集器不存在。",//20127
    ResetQuotaInfo: "配额中引用的甄别题已经在设计页面被修改，请重新设置配额信息。",//20128
    MaxQuotaGroup: "问卷最多只能设置2组配额行组。",//20129
    CantSetQuota: "当前无甄别题无法设置配额",//20130
    QuotaSuccessfulOperation: "操作成功。",//20131
    PleaseSetQuotaRow: "请先设置配额行。",//20132
    QuotaCantRepeat: "在同一配额行中不可以有相同甄别题。",//20133
    CreateSuccess: "生成成功。",//20134
    QuotaCountMisMatching: "行配额组中相同选项配额数不一致。",//20135
    IsDeleteCurrQuota: "确定要删除当前配额吗？",//20136
    IsDeleteQuotaGroup: "是否删除配额组？",//20137 
    IsRebuild: "重新生成配额表将清除当前的配额信息，是否重新生成？",//20138 


    FrozenMoneyOfTheUsers: "冻结后该用户将无法提现或充值。是否冻结该用户的资金？",//30001
    GiveUpTheContentOfTheInput: "是否放弃输入的内容？",//30002
    SaveTheCurrentChanges: "是否保存当前的修改？",//30003
    CanclePublish: "是否取消发布？",//30004
    ApplyForDownInAdvance: "该问卷处于在线发布状态，取消发布后，已完成问卷和对应奖励将继续有效，是否申请提前下线？",//30005

    WhetherToEmpty: "清空后问卷将无法恢复，是否清空？",//30007

    StartNodeUsed:"该开始节点已经在问卷设计中被使用，删除后将会影响您的问卷，是否确认删除？",//30009
    DisconnectAllConnection: "是否确认断开所有连接？",//30010
    DeleteAllConnection: "是否确认删除所有连接？",//30011
    CopyNode:"是否复制该节点？",//30012
    DeleteOptions: "是否确认删除该选项？",//30013
    ConfirmDeletion: "是否确认删除？",//30014
    DeleteQuotaSet: "是否确认删除配额组？",//30015
    DeleteQuotaLine: "是否确认删除配额？",//30016
    AgainGenerate: "重新生成配额表将清除当前的配额信息，是否重新生成？",//30017
    FinallySorted: "您未改变默认排序，默认排序是否是您选择的排序结果？",//30018
    ClosedPositionService: "关闭位置服务会导致无法参与部分问卷，确定关闭位置服务？",//30019
    ClearCacheData:"确认删除已缓存数据？",//30020
    RemoveShareBinding: "确定解除（新浪微博/微信/腾讯QQ）分享绑定？",//30021
    DetermineUpgrade: "现在有新版本可以升级，建议您升级以获得最新的功能和服务。",//30022
    ConfirmChange: "是否确认修改?",//30023
    ChangeUserState:"是否改变该用户的状态?",//30024
    DelVatConfirm:"确认是否删除？",//30025
    DelDirectory:"是否要删除目录?",//30026
    MoveQues:"是否将当前问卷移动到所选文件夹?",//30027
    SendEmail:"该用户未激活，请通过邮箱激活。是否重新发送验证邮件?",//30028
    ConfirmThroughAudit:"是否确认通过审核?",//30029
    ConfirmComvatAuditFailure:"是否确定该企业资质审核失败?",//30030
    ConfirmQuesAuditFailure:"是否确定该问卷审核失败?",//30031
    ConfirmResetPassword:"是否重置密码?",//30033
    DeleteQues:"删除后的问卷将无法找回，是否删除问卷?",//30034
    UploadPrompt:"图片正在上传。",//30035
    ConfirmCopyQues:"是否确认复制此问卷？",//30056
    SaveTheCurrentQuesChanges: "是否保存当前设置？",//70010
    SaveTheCurrentPublishChanges: "是否保存当前设置？",//70011
    SaveTheCurrentQuotaChanges: "是否保存当前设置？",//70012



    InputCopyQuesName: "请输入问卷复制后新问卷的名称。",//40001
    Create_InputFolderName: "创建新的文件夹，请输入文件夹名称。",//40002
    FolderNameRepeat:"该文件夹名已存在，请重新命名。",//40003
    Rename_InputFolderName: "重命名文件夹，请输入文件夹名称。",//40004
    SetVariable: "提示：请以@[]的方式设置变量。",//50001



    QSNRD_BackToBackup:"需要回到最新的备份版本吗?",//60001
    QSNRD_NoAuthorityToDo:"权限不足,无法进行此操作。",//60002
    QSNRD_ErrorStatusToDo:"该问卷状态下无法进行此操作。",//60003
    QSNRD_ConnPermit:"允许连接。",//60004
    QSNRD_ConnForbidToSelf:"连接点不允许和自身进行连接。",//60005
    QSNRD_ConnForbidSameParent:"同一个节点下的两个连接点不允许进行连接。",//60006
    QSNRD_ConnForbidSameType:"相同类型连接之间不允许连接。",//60007
    QSNRD_ConnForbidMultiOutput:"输出点只能输出一次。",//60008
    QSNRD_ConnForbidAlreadyExist:"该连接已存在。",//60009
    QSNRD_ConnForbidBack:"不能往回连接到节点自身之前的节点。",//60010
    QSNRD_ConnForbidNoTool:"已经存在输入的节点不能接受随机开始或循环开始。",//60011
    QSNRD_ConnForbidNoInput:"已经接受随机开始或循环开始的节点不能再接受其他输入。",//60012
    QSNRD_ConnForbidOnlySubjectAdd:"包含非题目节点的节点群不许加到随机组中。",//60013
    QSNRD_ConnForbidOnlySubjectOutput:"包含非题目节点的节点群不许输出到随机组中。",//60014
    QSNRD_ConnForbidCrossRandomGroup:"不同随机组之间的节点不能互相连接。",//60015
    QSNRD_ConnForbidNormalToRandom:"随机组节点和普通节点不能相互连接。",//60016
    QSNRD_ConnForbidNormalToLoop:"循环圈节点和普通节点不能相互连接。",//60017
    QSNRD_ConnForbidLoopToRandom:"循环圈节点和随机组节点不能相互连接。",//60018
    QSNRD_ConnForbidNoRandomStart:"普通节点和循环圈节点不能接受随机开始。",//60019
    QSNRD_ConnForbidNoLoopStart:"普通节点和随机组节点节点不能接受循环开始。",//60020
    QSNRD_ConnForbidNoLoopEnd:"普通节点和随机组节点节点不能接入循环结束。",//60021
    QSNRD_ConnForbidNoTerminal:"终端节点不能接受循环开始或循环结束。",//60022
    QSNRD_ConnForbidOnlyMultiToLoop:"已有多选选择题接入的循环节点不接受其他输入。",//60023
    QSNRD_ConnForbidNoMultiToLoop:"多选选择题无法接入已有输入的循环节点。",//60024
    QSNRD_ConnForbidToolToOut:"循环圈或随机组的节点不能外连。",//60025
    QSNRD_ConnForbidOutToTool:"外路节点不能连接到循环圈或随机组。",//60026
    QSNRD_ConnForbidCrossLoop :"不同循环圈的节点不能相互连接。",//60027
    QSNRD_ConnForbidCrossLoopStart:"已属于某个循环圈的节点不能接受另外的循环开始。",//60028
    QSNRD_ConnForbidCrossLoopEnd:"已属于某个循环圈的节点不能接到另外的循环结束。",//60029
    QSNRD_OptionNotBelowTwo:"选项不能少于2个。",//60030
    QSNRD_NoMoreOptionAllow:"已无法添加更多其他选项。",//60031
    QSNRD_RemoveOutputBeforeMulti:"设定为多选选择题之前请移除选项输出。",//60032
    QSNRD_RemoveOutputBeforeUnSingle:"设定为多选选择题之前请移除选项输出。",//60033
    QSNRD_Valid:"正常。",//60034
    QSNRD_InvalidNoInput:"没有正确设定输入。",//60035
    QSNRD_InvalidNoFullOutput:"没有正确设定所有输出。",//60036
    QSNRD_InvalidOutputRepeat:"总输出口和选项输出口输出有重复。",//60037
    QSNRD_InvalidOutputConflict:"总输出口和全部输出口都输出存在冲突。",//60038
    QSNRD_InvalidNoSubjectToRelate:"逻辑节点没有可相关的题目。",//60039
    QSNRD_InvalidNoLoopCircle:"循环节点没有循环圈。",//60040
    QSNRD_InvalidNoLoopVariable:"循环节点没有循环变量。",//60041
    QSNRD_InvalidOnlyMultiToLoop:"含变量的多选题只能单独输出循环节点。",//60042
    QSNRD_InvalidLoopMoreThanTwoFloor:"循环圈不能超过两层嵌套。",//60043
    QSNRD_InvalidIncompleteVariable:"有未完成输入的变量。",//60044
    QSNRD_InvalidVariableConflict:"变量内容或编号存在冲突。",//60045
    QSNRD_InvalidNoQuestionText:"未输入问题描述。",//60046
    QSNRD_InvalidIncompleteOptionX:"有未完成输入的列选项。",//60047
    QSNRD_InvalidConflictOptionX:"列选项内容或编号存在冲突。",//60048
    QSNRD_InvalidIncompleteOptionY:"有未完成输入的行选项。",//60049
    QSNRD_InvalidConflictOptionY:"行选项内容或编号存在冲突。",//60050
    QSNRD_InvalidNoRandomGroup:"随机节点没有随机组。",//60051
    QSNRD_InvalidIncompleteOption:"有未完成输入的选项。",//60052
    QSNRD_InvalidConflictOption:"选项内容或编号存在冲突。",//60053
    QSNRD_InvalidStartToEnd:"开始节点不能直接输出到结束节点。",//60054
    QSNRD_SaveFailed:"保存失败。",//60055
    QSNRD_NoBackupInfo:"没有备份信息。",//60056
    QSNRD_NoSearchInfo:"没有搜索信息。",//60057
    QSNRD_OnlyOneSuchNode:"一份问卷只允许存在一个该类节点。",//60058
    QSNRD_ConfirmVersionDelete:"版本被删除后将无法恢复，是否删除选中的版本？",//60059
    QSNRD_ConfirmVersionImport:"载入选中的版本后，会覆盖当前的设计，是否确认载入？",//60060
    QSNRD_NoChangeForOnLine:"当前问卷已经发布，如果需要修改问卷，请在“发布设置”中取消发布或停止收集。",//60061
    QSNRD_NoChangeForQuota:"当前问卷操作中涉及了问卷配额中引用题目，请在”问卷配额“中修改相关设置。",//60062
    QSNRD_VerNameExist:"版本名称重复。",//60063
    QSNRD_GiveupChange:"离开页面会丢失对当前问卷的编辑，是否保存当前问卷？",//60064
    QSNRD_PleaseWaitSaving:"正在保存，请保存完毕后再执行此操作。",//60065
    QSNRD_InvalidNoNodeName:"未输入节点名称。",//60066
    QSNRD_InvalidValidateRangeError:"验证限定中的最大值或最小值设定错误。",//60067
    QSNRD_InvalidMultiRangeError:"多选限定中的最大值或最小值设定错误。",//60068
    QSNRD_QuesNameExist: "问卷名称重复。",//60069
    QSNRD_ImageDeleteDisable: "该图片已经被使用，不可删除。",//60070
    QSNRD_OperationMediaDisable: "当前问卷状态下不允许操作媒体库。",//60071
    QSNRD_MultipleDisableFromOptionsOutput: "多选题不能从选项输出。",//60072
    QSNRD_GetPreviewFailed: "获取预览信息失败。",//60073
    QSNRD_JudgeRepaeatFailed: "判断重名失败，保存失败！",//60074
    QSNRD_ChangeNameSuccess: "更改名称成功！",//60075
    QSNRD_ChangeNameFauled: "更改名称失败！",//60076
    QSNRD_ImportVersionsFinish: "导入版本完成！",//60077
    QSNRD_ImportVersionsFauled: "导入版本失败！",//60078
    QSNRD_GetVersionsListFauled: "获取版本列表失败！",//60079
    QSNRD_DeleteVersionsSuccess: "删除版本成功！",//60080
    QSNRD_DeleteVersionsFauled: "删除版本失败！",//60081
    QSNRD_GetQuesStatusFauledImportFauled: "获取问卷状态失败，导入失败！",//60082
    QSNRD_GetDesignDataFauled: "获取问卷设计数据失败！",//60083
    QSNRD_GetQuotaInfoFauled: "获取配额信息失败，保存失败！",//60084
    QSNRD_GetQuesInfoFauled: "获取问卷信息失败，保存失败！",//60085
    QSNRD_CheckQuesNameFauled: "检查问卷名失败，保存失败！",//60086
    QSNRD_GetQuesStatusFauledDeBugFauled: "获取问卷状态失败，调试失败！",//60087
    QSNRD_CurrentQuesSaveDisable: "当前问卷状态下无法保存对问卷的编辑。如果确实需要编辑问卷，请先在问卷发布页面改变问卷状态。",//60088
    QSNRD_FileExceedCeiling: "所上传文件过大，上限为2M！",//60089
    QSNRD_CurrentBrowserUseDisable: "检测到在当前浏览器上可能出现部分功能体验不佳或无法使用的情况,是否仍然要继续？",//60090
    QSNRD_AdviceBrowser: "Tips:建议使用谷歌Chrome浏览器或苹果Safari浏览器。",//60091
    QSNRD_InvalidNoSubject: "问卷中没有检测到任何正式题！",//60092
    QSNRD_OptionNotExist:"没有选项。",//60093
    QSNRD_MarkItemMoreThanFive: "打分评价不能多于5个。",//60094
    QSNRD_MarkItemLowThanTwo: "打分评价不能少于2个。",//60095
    QSNRD_WrongMarkText: "打分评价项没有输入或存在冲突。",//60096
    QSNRD_WrongMarkValue: "打分分值最小值应小于最大值。",//60097
    QSNRD_DefaultMarkBeyond: "打分默认值不在最小值和最大值之间。",//60098



    AnalyticResult_SuccessfulOperation: "操作成功。",//70001
    AnalyticResult_IsDeleteOutRule: "是否要删除输出规则？",//70002
    AnalyticResult_IsDeleteOutResult: "是否要删除输出结果？",//70003
    AnalyticResult_IsDeleteOutFile: "是否要生成输出文件？",//70004
    AnalyticResult_SelectOptionToShow: "选择需要显示的题目",//70005
    AnalyticResult_SelectOneQuestion: "至少选择一个问题。",//70006
    AnalyticResult_ShowSet: "显示设置",//70007
    AnalyticResult_IsDeleteCurrentCondition: "确定要删除当前显示条件吗？",//70008
    AnalyticResult_CurrentQuesNoData: "当前问卷没有收集数据。",//70009
    AnalyticResult_IsExportData: "是否要导出数据？",//70010


    /**********************▲ ▲**********************/

};


var Branch = {
    1: "市场部",
    2: "采购部",
    3: "人力资源部",
    4: "办公室",
    5: "技术部",
    6: "其他"
};
var ErrorMessage = {
    404: "Not Found<br />Document or file requested by the client was not found.",
    401: "Not Authorized<br />Request requires user authentication."

};