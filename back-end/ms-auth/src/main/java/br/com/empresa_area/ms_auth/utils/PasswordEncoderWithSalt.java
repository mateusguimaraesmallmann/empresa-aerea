package br.com.empresa_area.ms_auth.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordEncoderWithSalt implements PasswordEncoder {

    private final String salt;
    private final BCryptPasswordEncoder delegate;

    public PasswordEncoderWithSalt(String salt, int strength) {
        this.salt = salt;
        this.delegate = new BCryptPasswordEncoder(strength);
    }

    @Override
    public String encode(CharSequence rawPassword) {
        return delegate.encode(rawPassword.toString() + salt );
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return delegate.matches(rawPassword.toString() + salt, encodedPassword);
    }
    
}
