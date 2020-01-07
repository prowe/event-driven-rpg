using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Orleans;

namespace backend.Controllers
{
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IClusterClient clusterClient;
        private readonly ILogger<MessageController> _logger;

        public MessageController(IClusterClient clusterClient, ILogger<MessageController> logger)
        {
            this.clusterClient = clusterClient;
            _logger = logger;
        }

        [HttpPost]
        [Route("/message")]
        public async Task Post([FromBody] string payload)
        {
            _logger.LogInformation($"Got payload: {payload}");

            var response = await clusterClient.GetGrain<IHello>(0L).SayHello(payload);

            _logger.LogInformation($"Got Response: {response}");
        }
    }

    public interface IHello : Orleans.IGrainWithIntegerKey
    {
        Task<string> SayHello(string msg);
    }

    class HelloGrain : Orleans.Grain, IHello
    {
        public Task<string> SayHello(string msg)
        {
            return Task.FromResult(string.Format("You said {0}, I say: Hello!", msg));
        }
    }
}
