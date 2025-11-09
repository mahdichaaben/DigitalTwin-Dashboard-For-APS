using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace backend_dash.Domain;

public static class PathManager
    {
        private static JsonElement[]? _allPathsList;
        private static readonly object _lock = new();

        /// <summary>
        /// Loads all paths from a JSON file into memory asynchronously.
        /// </summary>
        /// <param name="allPathJsonFile">Name of the JSON file (default: allCommands.json)</param>
        public static async Task LoadPathsAsync(string allPathJsonFile = "allCommands.json")
        {
            if (_allPathsList != null) return; // Already loaded

            lock (_lock)
            {
                if (_allPathsList != null) return;
            }

            var filePath = Path.Combine(AppContext.BaseDirectory, allPathJsonFile);
            if (!File.Exists(filePath))
                throw new FileNotFoundException($"{allPathJsonFile} not found at {filePath}");

            var jsonText = await File.ReadAllTextAsync(filePath);

            var parsed = JsonSerializer.Deserialize<JsonElement[]>(jsonText)
                ?? throw new InvalidOperationException($"Failed to parse {allPathJsonFile}");

            lock (_lock)
            {
                _allPathsList = parsed;
            }
        }


        public static string GetPathJson(string fromNodeRef, string toNodeRef)
        {
            if (_allPathsList == null)
                throw new InvalidOperationException("Path data is not loaded. Call LoadPathsAsync() first.");

            var searchKey = $"{fromNodeRef}-{toNodeRef}".ToUpperInvariant();

            foreach (var element in _allPathsList)
            {
                if (element.TryGetProperty("path", out JsonElement pathProp))
                {
                    var pathValue = pathProp.GetString()?.ToUpperInvariant();
                    if (pathValue == searchKey)
                    {
                        if (element.TryGetProperty("payload", out JsonElement payloadProp))
                            return payloadProp.GetRawText();
                        else
                            throw new InvalidOperationException("Path element found but missing 'payload' property.");
                    }
                }
            }

            throw new KeyNotFoundException($"No path found matching {searchKey}");
        }
    }
