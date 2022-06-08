using System;
using System.Data;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;

namespace ProjectFTK.Services;

public class MySQLDbServices
{
    private readonly MySqlConnection _mySqlConnection;

    public MySQLDbServices(MySqlConnection mySqlConnection)
    {
        _mySqlConnection = mySqlConnection;
    }

    public async Task DeleteAndCreateTable(MySqlCommand command, string tableName, string valueNames)
    {
        command.CommandText = $"DROP TABLE IF EXISTS {tableName};";
        await command.ExecuteNonQueryAsync();

        command.CommandText = $"CREATE TABLE {tableName} ({valueNames});";
        await command.ExecuteNonQueryAsync();
    }

    public async Task InsertValues(MySqlCommand command, string tableName, string values)
    {
        command.CommandText = $"INSERT INTO {tableName} VALUES ({values})";
        await command.ExecuteNonQueryAsync();
    }

    public async Task<T> GetData<T>(MySqlCommand command, string tableName, string sqlWhereFilter, string columns = "*")
    {
        command.CommandText = $"SELECT {columns} FROM {tableName} WHERE {sqlWhereFilter}";

        using var reader = await command.ExecuteReaderAsync();

        var datatable = new DataTable();
        datatable.Load(reader);

        var json = JsonConvert.SerializeObject(datatable);
        return JsonConvert.DeserializeObject<T>(json);
    }

    public async Task UpdateData(MySqlCommand command, string tableName, string setValues, string sqlWhereFilter)
    {
        command.CommandText = $"UPDATE {tableName} SET {setValues} WHERE {sqlWhereFilter}";
    }

    public async Task<int> GetCount(MySqlCommand command, string tableName, string sqlWhereFilter, string column)
    {
        command.CommandText = $"SELECT COUNT({column}) FROM {tableName} WHERE {sqlWhereFilter}";

        using var reader = await command.ExecuteReaderAsync();
        await reader.ReadAsync();
        var retval = reader.GetInt32(0);

        return retval;
    }
}