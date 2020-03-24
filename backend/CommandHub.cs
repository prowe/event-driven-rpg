using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using backend.Commands;
using Microsoft.Extensions.Logging;

namespace backend
{
    public class CommandHub : Hub
    {
        private readonly ILogger<CommandHub> logger;

        public CommandHub(ILogger<CommandHub> logger)
        {
            this.logger = logger;
        }

        public async Task SetAreaAttributes(SetAreaAttributesCommand command)
        {
            logger.LogCritical($"SetAreaAttributes: {command}");
        }
    }
}