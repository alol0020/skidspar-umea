using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using HtmlAgilityPack;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Web;
using System.Text;
using System.Linq;
using System.Text.RegularExpressions;
using System.Globalization;

namespace SkiData
{


    public class SkiTrack
    {
        public string Name { get; set; }
        public string Status { get; set; }
        public DateTime LastUpdated { get; set; }

    }
    public class SkiLocation
    {
        public string Name { get; set; }
        public List<SkiTrack> Tracks { get; set; } = new List<SkiTrack>();
    }

   
    public static class Function1
    {
        static string StringFixer(string input)
        {

            return input
                .Replace("&#197;", "Å")
                .Replace("&#196;", "Ä")
                .Replace("&#214;", "Ö")
                .Replace("&#229;", "å")
                .Replace("&#228;", "ä")
                .Replace("&#246;", "ö");


        }

        [FunctionName("Function1")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");



            // From Web
            var url = "http://anlaggningsregister.umea.se/SmsGrupp.aspx?gid=16";
            var web = new HtmlWeb();
            var doc = await web.LoadFromWebAsync(url);

            List<SkiLocation> skiLocations = new List<SkiLocation>();

            foreach (HtmlNode tr in doc.DocumentNode.SelectNodes("//tr[contains(@class,'GridViewRow') or contains(@class,'GridViewAltRow')]"))
            {
                try
                {
                    var tds = tr.SelectNodes("./td");
                    if (tds != null && tds.Count > 0)
                    {
                        var location = StringFixer(tds[0].InnerHtml);
                        var status = StringFixer(tds[1].ChildNodes[1].InnerText); 
                        var temp = location.Split(' ');
                        var name = temp[0];
                        var trackName = location;

                        Regex rgx = new Regex(@"\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}");
                        Match mat = rgx.Match(status);
                        var cultureInfo = new CultureInfo("sv-SE");
                        var time = DateTime.Parse(mat.ToString(), cultureInfo);

                        var existingLocation = skiLocations.Find(x => x.Name.Equals(name));
                        if (existingLocation != null)
                        {
                            existingLocation.Tracks.Add(new SkiTrack { Name = trackName, Status = status, LastUpdated=time });
                        }
                        else
                        {
                            var newSkiLocation = new SkiLocation { Name = name };
                            newSkiLocation.Tracks.Add(new SkiTrack { Name = trackName, Status = status, LastUpdated=time});
                            skiLocations.Add(newSkiLocation);

                        }


                    }
                }
                catch (Exception e)
                {
                    log.LogError(e.Message);
                }


            }

            return new OkObjectResult(skiLocations.OrderByDescending(x=>x.Tracks.Max(y=>y.LastUpdated)));
        }
    }
}
