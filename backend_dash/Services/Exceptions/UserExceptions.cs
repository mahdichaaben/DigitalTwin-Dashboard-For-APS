namespace backend_dash.Services.Exceptions
{
    public class UsernameTakenException : Exception
    {
        public UsernameTakenException(string username)
            : base($"Username '{username}' is already taken.") { }
    }

    public class EmailTakenException : Exception
    {
        public EmailTakenException(string email)
            : base($"Email '{email}' is already registered.") { }
    }


    public class InvalidRefreshTokenException : Exception
    {
        public InvalidRefreshTokenException()
            : base("The provided refresh token is invalid or has expired.") { }
    }


    public class InvalidAccessTokenException : Exception
    {
        public InvalidAccessTokenException()
            : base("The access token is invalid or has been revoked.") { }

        public InvalidAccessTokenException(string message) : base(message) { }
    }

    public class InvalidCredentialsException : Exception
    {
        public InvalidCredentialsException()
            : base("Invalid username or password.") { }

        public InvalidCredentialsException(string message)
            : base(message) { }
    }
}