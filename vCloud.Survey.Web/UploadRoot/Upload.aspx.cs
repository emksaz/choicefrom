using System;
using System.Web;
using System.IO;
using  System.Security.Cryptography;

public partial class Upload : System.Web.UI.Page
{

    private readonly string serverPath = @"C:\TestWebClient\";

    private void Page_Load(object sender, System.EventArgs e)
    { 
		if (Request.Params["action"] =="upext")
		{
			
			GetSize();
		}
		else if (Request.Params["action"] =="gettoken")
		{
			
			GetToken();
		}

			
		 
		  
    }
	private void GetToken()
	{
		  Response.Clear();
		  string name=Request.Params["name"];
		  string size=Request.Params["size"];
		  string retVal=GetMD5Hash(name+size+DateTime.Now.ToString());
		  Response.Write("{token:'"+retVal+"',success:'true'}");
		  Response.End();//*/
	}

	private void GetSize()
	{

		HttpFileCollection MyFileCollection;
		HttpPostedFile MyFile;
		long FileLen=0;
		Stream MyStream;
		MyFileCollection = Request.Files;
		FileLen=Request.InputStream.Length;
		
		if(FileLen>0)
		{
			byte[] input = new byte[FileLen];
			MyStream=Request.InputStream;
			MyStream.Position = 0;
			MyStream.Read(input, 0, (int)FileLen);
			FileStream fs = null;
			string token=Request.Params["token"];
			string name=Request.Params["name"];
            string[] names=name.Split((".").ToCharArray());
            string uploadPath = HttpContext.Current.Server.MapPath("UploadImages" + "\\") + token + "." + names[names.Length-1];
            fs = new FileStream(uploadPath, FileMode.OpenOrCreate, FileAccess.Write);
			fs.Seek(0, SeekOrigin.End);
            fs.Write(input,0,(int)FileLen);
			fs.Position=0;
			FileLen=fs.Length;
			MyStream.Dispose();
			MyStream.Close();
			fs.Dispose();
            fs.Close();

		}
		string value="{start:"+FileLen+",success:'true'}";
		Response.Clear();
		Response.Write(value);
		Response.End();//*/

		
	}

	private string GetMD5Hash(String input)
	{
		string hashPwd=System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(input, "MD5");
		return hashPwd;
	}
	
}