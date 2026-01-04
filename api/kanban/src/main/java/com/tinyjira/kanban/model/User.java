package com.tinyjira.kanban.model;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "tbl_user")
public class User extends AbstractEntity<Long> implements UserDetails {
    private String name;
    
    private String lastname;
    
    private String email;
    
    private String password;
    
    private String bio;
    
    private String avatarUrl;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<Comment> comments = new HashSet<>();

    @ManyToMany(mappedBy = "users")
    private Set<Task> tasks = new HashSet<>();
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "tbl_user_has_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    
    
    public void updateBio(String newBio){
        if(newBio == null || newBio.length() > 500){
            throw new IllegalArgumentException("Invalid bio");
        }
        this.bio = newBio;
    }
    
    public void updateAvatar(String newAvatarUrl){
        this.avatarUrl = newAvatarUrl;
    }
    
    public void changePassword(String currentPasswordRaw, String newPasswordRaw, PasswordEncoder encoder) {
        if (!encoder.matches(currentPasswordRaw, this.password)) {
            throw new IllegalArgumentException("Old password is incorrect!");
        }
        if (newPasswordRaw.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters");
        }
        this.password = encoder.encode(newPasswordRaw);
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }
    
    @Override
    public String getUsername() {
        return "";
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return true;
    }
    
}
