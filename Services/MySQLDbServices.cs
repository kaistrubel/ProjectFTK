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

        command.CommandText = $"SELECT {columns} FROM {tableName} WHERE {sqlWhereFilter}";

        using var reader = await command.ExecuteReaderAsync();

        var datatable = new DataTable();
        datatable.Load(reader);

        await command.Connection.CloseAsync();

        var json = JsonConvert.SerializeObject(datatable);
        return JsonConvert.DeserializeObject<T>(json);
    }

    public async Task UpdateData(string tableName, string setValues, string sqlWhereFilter)
    {
        using var command = _mySqlConnection.CreateCommand();
        await command.Connection.OpenAsync();

        command.CommandText = $"UPDATE {tableName} SET {setValues} WHERE {sqlWhereFilter}";

        await command.Connection.CloseAsync();
    }

    public async Task<int> GetCount(string tableName, string sqlWhereFilter, string column)
    {
        using var command = _mySqlConnection.CreateCommand();
        await command.Connection.OpenAsync();

        command.CommandText = $"SELECT COUNT({column}) FROM {tableName} WHERE {sqlWhereFilter}";

        using var reader = await command.ExecuteReaderAsync();
        await reader.ReadAsync();
        var retval = reader.GetInt32(0);
        await command.Connection.CloseAsync();

        return retval;
    }
}