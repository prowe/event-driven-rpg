using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Orleans;
using Orleans.Streams;

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
        public async Task Post([FromBody] ChatEvent command)
        {
            _logger.LogInformation($"Got payload: {command.Message}");

            IAsyncStream<ChatEvent> stream = clusterClient
                .GetStreamProvider("default")
                .GetStream<ChatEvent>(Guid.Empty, "chat-bots");

            await stream.OnNextAsync(command);
        }
    }

    public class ChatEvent
    {
        public string Message {get; set;}
    }

    public interface IHello : Orleans.IGrainWithGuidKey
    {
        Task<string> SayHello(string msg);
    }

    [ImplicitStreamSubscription("chat-bots")]
    class HelloGrain : Orleans.Grain, IHello
    {
        public ILogger<HelloGrain> logger { get; }

        public HelloGrain(ILogger<HelloGrain> logger)
        {
            this.logger = logger;
        }

        public override async Task OnActivateAsync()
        {
            var guid = this.GetPrimaryKey();
            var streamProvider = GetStreamProvider("default");
            var stream = streamProvider.GetStream<ChatEvent>(guid, "chat-bots");
            //Set our OnNext method to the lambda which simply prints the data, this doesn't make new subscriptions because we are using implicit subscriptions via [ImplicitStreamSubscription].
            await stream.SubscribeAsync<ChatEvent>(OnChatEvent);
        }

        private Task OnChatEvent(ChatEvent chatEvent, StreamSequenceToken token)
        {
            this.logger.LogInformation($"Got chat event: {chatEvent.Message}");
            return Task.CompletedTask;
        }

        public Task<string> SayHello(string msg)
        {
            return Task.FromResult(string.Format("You said {0}, I say: Hello!", msg));
        }
    }
}
