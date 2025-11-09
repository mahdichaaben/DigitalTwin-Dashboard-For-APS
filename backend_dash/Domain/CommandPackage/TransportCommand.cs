using System;
using System.Text.Json;
using System.Text.Json.Nodes;


namespace backend_dash.Domain;

public class TransportCommand : Command
    {
        public string FromNodeRef { get; set; }
        public string ToNodeRef { get; set; }

    protected TransportCommand() { }
    public TransportCommand(string id, string commandName, string state,string orderId,
                                string fromNodeRef, string toNodeRef)
            : base(id, commandName, state,orderId)
        {
            FromNodeRef = fromNodeRef ?? throw new ArgumentNullException(nameof(fromNodeRef));
            ToNodeRef = toNodeRef ?? throw new ArgumentNullException(nameof(toNodeRef));
        }

        public override string BuildPayload()
        {
            if (Module == null)
                throw new InvalidOperationException("Module must be assigned to build payload.");

            string rawPayloadJson = PathManager.GetPathJson(FromNodeRef, ToNodeRef);

            // Parse JSON
            JsonNode payloadNode = JsonNode.Parse(rawPayloadJson)
                ?? throw new InvalidOperationException("Invalid payload JSON");

            payloadNode["id"] = Id;
            payloadNode["command"] = CommandName;
        payloadNode["orderId"] = OrderId;
        var nodes = payloadNode["nodes"]?.AsArray();
            if (nodes != null)
            {
                foreach (var node in nodes)
                {
                    var action = node?["action"];
                    var metadata = action?["metadata"]?.AsObject();

                    if (metadata != null)
                    {
                        if (metadata.ContainsKey("loadType") && Metadata.TryGetValue("type", out var typeValue))
                        {
                            metadata["loadType"] = typeValue?.ToString();
                        }

                        if (metadata.ContainsKey("type") && Metadata.TryGetValue("type", out var type))
                        {
                            metadata["type"] = type?.ToString();
                        }

                        if (metadata.ContainsKey("loadId") && Metadata.TryGetValue("id", out var idValue))
                        {
                            metadata["loadId"] = idValue?.ToString();
                            metadata["id"] = idValue?.ToString();
                        }
                    }
                }
            }

            return payloadNode.ToJsonString(new JsonSerializerOptions { WriteIndented = false });
        }

    }

