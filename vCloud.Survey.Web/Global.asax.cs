using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Configuration;
using VQ.Common;

namespace vCloud.Survey.Web
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            if (!DevExpress.Xpo.Session.DefaultSession.IsConnected)
            {
                DevExpress.Xpo.Session.DefaultSession.ConnectionString = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["SurveyConn"].ConnectionString;
            }
            new MailClientInfo(ConfigurationManager.AppSettings["FromMailAddress"], ConfigurationManager.AppSettings["SMTPHost"], int.Parse(ConfigurationManager.AppSettings["SMTPPort"].ToString()), int.Parse(ConfigurationManager.AppSettings["SMTPTimeout"].ToString()), ConfigurationManager.AppSettings["SMTPUserName"], ConfigurationManager.AppSettings["SMTPPassword"]);
        }
    }
}
