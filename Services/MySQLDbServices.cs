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

    public async Task DeleteAndCreateTable(string tableName, string valueNames)
    {
        using var command = _mySqlConnection.CreateCommand();
        await command.Connection.OpenAsync();

        command.CommandText = $"DROP TABLE IF EXISTS {tableName};";
        await command.ExecuteNonQueryAsync();

        command.CommandText = $"CREATE TABLE {tableName} ({valueNames});";
        await command.ExecuteNonQueryAsync();

        await command.Connection.CloseAsync();
    }

    public async Task InsertValues(string tableName, string values)
    {
        using var command = _mySqlConnection.CreateCommand();
        await command.Connection.OpenAsync();

        command.CommandText = $"INSERT INTO {tableName} VALUES ({values})";
        await command.ExecuteNonQueryAsync();

        await command.Connection.CloseAsync();
    }

    public async Task<T> GetData<T>(string tableName, string sqlWhereFilter, string columns = "*")
    {
        using var command = _mySqlConnection.CreateCommand();
        await command.Connection.OpenAsync();

        //teacher_email, code, id
        //teacher_email = '{email}' AND code = '{code}'

        command.CommandText = $"SELECT {columns} FROM {tableName} WHERE {sqlWhereFilter}";

        using var reader = await command.ExecuteReaderAsync();

        var datatable = new DataTable();
        datatable.Load(reader);

        await command.Connection.CloseAsync();

        var json = JsonConvert.SerializeObject(datatable);
        return JsonConvert.DeserializeObject<T>(json);
    }
}