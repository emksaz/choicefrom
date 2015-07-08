using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace vCloud.News.Web.Controllers
{
    public class ErrorController : Controller
    {
        //
        // GET: /Error/

        public ActionResult Error()
        {
            return View();
        }
        public ActionResult ErrorDB()
        {
            return View("Error", (object)"数据库连接出错");
        }

        public ActionResult ErrorNoRght()
        {
            return View("Error", (object)"401");
        }


        public ActionResult ErrorNoRghtByerror(string error)
        {
            return View("Error", (object)error);
        }

    }
}
