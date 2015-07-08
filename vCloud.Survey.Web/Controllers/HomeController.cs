using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using VQ.SessionManage;
using System.IO;
using System.Drawing;
using System.Drawing.Imaging;
using System.Configuration;
using System.Collections.Specialized;
using VQ.Common;

using Newtonsoft.Json;
using vCloud.Survey.Model.SurveyInfo.UM;
using vCloud.Survey.Model.SurveyInfo.UC;
using vCloud.Survey.Model.SurveyAdminInfo.Sys;
using vCloud.Survey.Model.SurveyInfo.Sys;
using vCloud.Survey.Business.UM;
using vCloud.Survey.Business.UC;
using vCloud.Survey.Controllers.Helper;
using vCloud.Survey.Business.Sys;
using vCloud.Survey.Business.UB;
using System.Diagnostics;
using System.Net;
using System.Text;
using NetDimension.Weibo;





namespace vCloud.Survey.Web.Controllers
{
    public class HomeController : BaseController
    {

        public ActionResult QQLogin()
        {
            return this.View();
        }
        public ActionResult QQQuickLogin(string type, string openId, string nickName, string pic)
        {
            string message = "";
            string email = "";
            string password = "";
            try
            {
                if (type == "0")
                {
                    UMQuickLoginManager.Instance.QQQuickLogin(openId, nickName, pic, ref email, ref password);
                }
                if (type == "1")//绑定
                {
                    message = UMQuickLoginManager.Instance.BindThirdParty(openId, nickName, pic, QuickLoginType.QQ, SignInAccount.GID, ref email, ref password);
                }

                if (type == "2")//解除绑定
                {
                    UMQuickLoginManager.Instance.ReleseBind(openId, ref email, ref password);
                }
            }
            catch (Exception e)
            {
                message = "操作失败。";
            }

            return Json(new { Email = email, Password = password, Message = message });
        }

        public ActionResult SinaLogin(string type, string code)
        {
            try
            {
                ViewData["Code"] = code;
                ///如果code为空表示未登录成功

                OAuth oauth = new OAuth("3780257084", "82231a680efedcd67b30c41c714ec85a", "http://www.csvfx.com/Home/SinaLogin?type=1");
                var token = oauth.GetAccessTokenByAuthorizationCode(code);
                ViewData["accessToken"] = token.Token;
                Client Sina = new Client(new OAuth("3780257084", "82231a680efedcd67b30c41c714ec85a", token.Token, null));
                string openID = Sina.API.Entity.Account.GetUID();

                var user = Sina.API.Dynamic.Users.Show(ViewData["UID"].ToString());
                string pic = user["profile_image_url"];
                string nickName = user["screen_name"];
                string email = "";
                string password = "";
                if (type == "0")//登录
                {
                    UMQuickLoginManager.Instance.SinaQuickLogin(openID, nickName, pic, ref email, ref password);
                    ValidateUser(email, password, 2, "quicklogin");
                    return RedirectToAction("Dashboard", "Home");
                }
                if (type == "1")//绑定
                {
                    ViewData["Message"] = UMQuickLoginManager.Instance.BindThirdParty(openID, nickName, pic, QuickLoginType.微博, SignInAccount.GID, ref email, ref password);
                    ViewData["Email"] = email;
                    ViewData["Password"] = password;
                    return View();
                }

                if (type == "2")//解除绑定
                {
                    UMQuickLoginManager.Instance.ReleseBind(openID, ref email, ref password);
                    ViewData["Email"] = email;
                    ViewData["Password"] = password;
                    return View();
                }

            }
            catch (Exception ex)
            {
                RedirectToAction("Error", "Error");
            }
            return RedirectToAction("Error", "Error");
        }
        public ActionResult Index()
        {
            //return SinaLogin("");

            ViewData["IsLogin"] = true;
            if (null == Session["Account"] || !(Session["Account"] is AccountClone))
            {
                try
                {
                    if (System.Web.HttpContext.Current.Request.Cookies["MyCSCook"] == null)
                    {
                        ViewData["IsLogin"] = false;
                    }
                }
                catch { }
            }
            var v = VQValueManager.Instance.GetFirstQuesLink();
            Random rd = new Random();
            int num = rd.Next(v.Count());
            ///获取随机问卷链接
            if (num == v.Count() && v.Count() > 0)
            {
                ViewData["QuesUrl"] = ConfigurationManager.AppSettings["Oauth"].ToString() + v[num - 1];
            }
            else if (num < v.Count() && v.Count() > 0)
            {
                ViewData["QuesUrl"] = ConfigurationManager.AppSettings["Oauth"].ToString() + v[num];
            }
            else
                ViewData["QuesUrl"] = "";
            ViewData["IsShowDemo"] = ConfigurationManager.AppSettings["IsShowDemo"].ToString();
            return View();
        }

        public ActionResult Tmpindex()
        {
            ViewData["IsLogin"] = true;
            if (null == Session["Account"] || !(Session["Account"] is AccountClone))
            {
                try
                {
                    if (System.Web.HttpContext.Current.Request.Cookies["MyCSCook"] == null)
                    {

                        ViewData["IsLogin"] = false;
                    }
                }
                catch { }
            }

            ViewData["QuesUrl"] = "";
            return View();
        }


        public ActionResult SendContactUsEMail(string name, string title, string email, string content)
        {
            bool istrue = true;
            try
            {
                UMUserManager.Instance.SendContactUsEMail(name, title, email, content);
            }
            catch (Exception ex)
            {
                istrue = false;
            }
            return Json(new { IsTrue = istrue });
        }


        public ActionResult DashBoard()
        {
            if (null == Session["Account"] || !(Session["Account"] is AccountClone))
            {
                try
                {
                    if (System.Web.HttpContext.Current.Request.Cookies["MyCSCook"] == null)
                    {

                        return RedirectToAction("SignIn", "Home");
                    }
                }
                catch { }


            }
            //账号禁用处理
            IsAccountUsable();

            ViewData["IsShowDemo"] = ConfigurationManager.AppSettings["IsShowDemo"].ToString();
            return View();
        }


        public ActionResult TestGetID(string id)
        {
            return Json("abc" + id);
        }
        /// <summary>
        /// 获取验证码
        /// </summary>
        /// <returns></returns>
        public ActionResult GetCode()
        {
            var cap = new Captcha();
            cap.Output();
            Session["VerifyCode"] = cap.VerifyCodeText;
            Session["VerifyCodeDate"] = DateTime.Now.ToString();
            //return Json("123");
            return null;
        }
        public ActionResult SignOut()
        {
            //SysLogRule.Instance.AddSysLog(SignInAccount.UserName, SysLogType.信息日志, "退出系统", "");
            Session["VerifyCode"] = "";
            Session["Account"] = "";
            Session["MYZYPersonPersonalizedInfo"] = "";

            if (System.Web.HttpContext.Current.Request.Cookies["MyCSCook"] != null)
            {
                System.Web.HttpContext.Current.Request.Cookies["MyCSCook"].Values.Remove("AccountClone");
                TimeSpan ts = new TimeSpan(-1, 0, 0, 0);
                System.Web.HttpContext.Current.Request.Cookies["MyCSCook"].Expires = DateTime.Now.Add(ts);//删除整个Cookie，只要把过期时间设置为现在
                Response.AppendCookie(System.Web.HttpContext.Current.Request.Cookies["MyCSCook"]);
            }
            return Json("");
        }

        public ActionResult SignIn()
        {
            //string a= DESEncryption.Instance.Encrypto("1122@1122.com");
            //string b = DESEncryption.Instance.Decrypto(a);
            //Function.Instance.QRImageAddLogo("http://www.sina.com/", Server.MapPath("\\UploadFiles\\Photo\\b.png"), Server.MapPath("\\UploadFiles\\Photo\\icon256.jpg"));amy@kalsco.com
            //Function.Instance.ImageCut(Server.MapPath("\\UploadFiles\\Photo\\test.png"), Server.MapPath("\\UploadFiles\\Photo\\500-1000.jpg"), 640, 360, 341, 250, 640, 1280, false);
            Session["VerifyCode"] = "";
            Session["Account"] = "";
            Session["MYZYPersonPersonalizedInfo"] = "";
            if (System.Web.HttpContext.Current.Request.Cookies["MyCSCook"] != null)
            {
                System.Web.HttpContext.Current.Request.Cookies["MyCSCook"].Values.Remove("AccountClone");
                TimeSpan ts = new TimeSpan(-1, 0, 0, 0);
                System.Web.HttpContext.Current.Request.Cookies["MyCSCook"].Expires = DateTime.Now.Add(ts);//删除整个Cookie，只要把过期时间设置为现在
                Response.AppendCookie(System.Web.HttpContext.Current.Request.Cookies["MyCSCook"]);
            }
            if (System.Web.HttpContext.Current.Request.Cookies["EmailCookie"] != null)
            {
                ViewData["Email"] = Encryption.Instance.Decrypto(System.Web.HttpContext.Current.Request.Cookies["EmailCookie"]["EmailInfo"]);
            }
            return View();
        }

        public ActionResult SignInystest()
        {

            //Function.Instance.QRImageAddLogo("http://www.sina.com/", Server.MapPath("\\UploadFiles\\Photo\\b.png"), Server.MapPath("\\UploadFiles\\Photo\\icon256.jpg"));amy@kalsco.com
            //Function.Instance.ImageCut(Server.MapPath("\\UploadFiles\\Photo\\test.png"), Server.MapPath("\\UploadFiles\\Photo\\500-1000.jpg"), 640, 360, 341, 250, 640, 1280, false);
            Session["VerifyCode"] = "";
            Session["Account"] = "";
            Session["MYZYPersonPersonalizedInfo"] = "";
            if (System.Web.HttpContext.Current.Request.Cookies["MyCSCook"] != null)
            {
                System.Web.HttpContext.Current.Request.Cookies["MyCSCook"].Values.Remove("AccountClone");
                TimeSpan ts = new TimeSpan(-1, 0, 0, 0);
                System.Web.HttpContext.Current.Request.Cookies["MyCSCook"].Expires = DateTime.Now.Add(ts);//删除整个Cookie，只要把过期时间设置为现在
                Response.AppendCookie(System.Web.HttpContext.Current.Request.Cookies["MyCSCook"]);
            }
            if (System.Web.HttpContext.Current.Request.Cookies["EmailCookie"] != null)
            {
                ViewData["Email"] = Encryption.Instance.Decrypto(System.Web.HttpContext.Current.Request.Cookies["EmailCookie"]["EmailInfo"]);
            }
            return View();
        }

        /// <summary>
        /// 登录页面注册用户时处理内容
        /// </summary>
        /// <param name="realname"></param>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <param name="valcode"></param>
        /// <returns></returns>
        public ActionResult RegisteredUser(string email, string name, string password, string inviteCode)
        {
            object val = "";
            bool isCodeError = false;
            string message = "";
            try
            {
                isCodeError = UMInviCodeManager.Instance.CheckInviteCode(inviteCode);
                if (!isCodeError)//邀请码验证通过才予以注册
                {
                    UMUserManager.Instance.RegisteredUser(email, name, password, inviteCode, Guid.Empty);
                    message = "注册成功！";
                }
            }
            catch (Exception ex)
            {
                message = ex.Message;
            }
            var jsonData = new
            {
                Message = message,
                IsCodeError = isCodeError
            };
            return Json(jsonData);
        }
        public ActionResult ValidateUser(string email, string password, int isCheck, string loginType)
        {

            bool islogin = false;///是否登录成功
            //bool isemail = false;///是否邮件验证过
            string message = "";///出错原因
            string url = "";///跳转的默认路径

            var jsonData = new
            {
                Islogin = islogin,
                //Isemail = isemail,
                Message = message,
                Url = url,
            };



            UMUser account = UMUserManager.Instance.Login(email, password, loginType);
            //终端设备IP
            string ipaddress = System.Web.HttpContext.Current.Request.UserHostAddress.ToString().Trim();
            //终端信息
            string terminalInfo = System.Web.HttpContext.Current.Request.UserAgent.ToString().Trim();
            if (account != null)
            {
                if (account.EnableFlag == "N")
                {
                    islogin = false;

                    message = "登录失败。";
                    //isemail = false;
                    jsonData = new
                    {
                        Islogin = islogin,
                        //Isemail = isemail,
                        Message = message,
                        Url = url,
                    };
                    return Json(jsonData);
                }
                islogin = true;


                AccountClone userClone = new AccountClone();
                List<TmpAccountCompany> tmpAccountCompanyList = new List<TmpAccountCompany>();

                userClone.GID = account.UserID;
                //userClone.CompanyList = tmpAccountCompanyList;
                userClone.UserName = account.UserName;
                userClone.RealName = account.Name;
                userClone.ModuleList = null;


                GetTmpAccountCompanyByAccountClone(userClone);
                Session["Account"] = userClone;
                SysCompanyLogManager.Instance.AddSysComLog(SignInAccount.UserName, SysLogType.信息日志, "登录系统", "");


                //插入企业用户行为日志
                UserBehaviorManager.Instance.AddUserBehaviorLog(SignInAccount.GID.ToString(), "系统登录", SignInAccount.SelectCompanyID, "", 'S', ipaddress, terminalInfo);

                //用户退出登录保留登录邮箱(30天内记住我)
                HttpCookie emailCok = System.Web.HttpContext.Current.Request.Cookies["EmailCookie"];
                if (isCheck == 1)
                {
                    emailCok = new HttpCookie("EmailCookie");//初使化并设置Cookie的名称
                    emailCok.Expires = DateTime.Now.AddMonths(1);//设置过期时间
                    emailCok.Values.Add("EmailInfo", Encryption.Instance.Encrypto(email));
                    Response.AppendCookie(emailCok);
                }
                else if (isCheck == 0)
                {
                    if (emailCok != null)
                    {
                        TimeSpan ts = new TimeSpan(-1, 0, 0, 0);
                        emailCok.Expires = DateTime.Now.Add(ts);//删除整个Cookie，只要把过期时间设置为现在
                        Response.AppendCookie(emailCok);
                    }
                }
            }
            else
            {
                jsonData = new
                {
                    Islogin = islogin,
                    // Isemail = isemail,
                    Message = "用户不存在或密码错误!",
                    Url = url,
                };
                //登录失败
                // UserBehaviorManager.Instance.AddUserBehaviorLog(SignInAccount.GID.ToString(), "系统登录", SignInAccount.SelectCompanyID, "", 'F', ipaddress, terminalInfo);
                return Json(jsonData);
            }


            url = "/Home/DashBoard";
            jsonData = new
            {
                Islogin = true,
                //Isemail = true,
                Message = message,
                Url = url,
            };
            return Json(jsonData);
        }
        //验证登录是否超时
        public ActionResult CheckSessionLost()
        {
            if (VerifySession())
            {
                return Json(new { IsSessionLost = true, Message = "登录超时。" });
            }
            return Json(new { IsSessionLost = false });
        }
        //获取权限列表
        public ActionResult GetModuleList()
        {
            IList<string> moduleList = null;
            moduleList = UMUserManager.Instance.GetModuleButtonList(SignInAccount.SelectCompanyID);
            return Json(moduleList);
        }

        public ActionResult test()
        {
            var val = "/Home/DashBoard#/QM";
            try
            {
                //ADRole a = new ADRole(DBManage.DBSession);
                //a.GID = new Guid();
                //a.Save();

                VQValue a = new VQValue(DBManage.DBSession);
                a.GID = new Guid();
                a.Save();
                //VQValueSet b = new VQValueSet(DBManage.DBSession);
                //b.GID = new Guid();
                //b.Save();
                //ModuleButton c = new ModuleButton(DBManage.DBSession);
                //c.GID = new Guid();
                //c.Save();
                //SysLog d = new SysLog(DBManage.DBSession);
                //d.GID = new Guid();
                //d.Save();
                val = "ok";
            }
            catch (Exception ex)
            {
                val = ex.Message;
            }
            return Json(val);
        }
    }

}