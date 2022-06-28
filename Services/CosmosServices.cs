using System;
using System.Linq.Expressions;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;

namespace ProjectFTK.Services;

public class CosmosServices
{
    public async Task<List<T>> GetCosmosItem<T>(Container container, Expression<Func<T, bool>> predicate)
    {
        var itemList = new List<T>();
        try
        {
            using (FeedIterator<T> setIterator = container.GetItemLinqQueryable<T>()
                    .Where(predicate)
                    .ToFeedIterator())
            {
                //Asynchronous query execution
                while (setIterator.HasMoreResults)
                {
                    foreach (var item in await setIterator.ReadNextAsync())
                    {
                        itemList.Add(item);
                    }
                }
            }
        }
        catch
        {
            //most likely item doesn't exist
        }

        return itemList;
    }
}