---
title: Login
category: Login
order: 1
---



<script src="{{ site.baseurl }}/scripts/track.js"></script>
<script>
    tracker();
</script>
<div class="login-container">
        <form id="login-form" >
            <input type="text" class="login-input-field" id="login-username"  placeholder="Username" required>
            <input type="password" class="login-input-field" id="login-password"  placeholder="Password" required>
            <button type="submit" class="login-submit-btn">Login</button>
        </form>
        <a href="#" class="login-forgot-password">Forgot your password?</a>
</div>

<div class="login-modal" id="changePasswordModal" style="display: none;">
        <div class="login-modal-content">
            <h2>Change Your Password</h2>
            <form id="changePasswordForm">
                <div class="login-form-group">
                    <label for="currentPassword">Current Password</label>
                    <input type="password" id="currentPassword" name="currentPassword" required>
                </div>
                <div class="login-form-group">
                    <label for="newPassword">New Password</label>
                    <input type="password" id="newPassword" name="newPassword" required>
                </div>
                <div class="login-form-group">
                    <label for="confirmPassword">Confirm New Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required>
                </div>
                <div id="errorMessage" class="login-error"></div>
                <button type="button" onclick="validateAndSubmit()">Submit</button>
            </form>
        </div>
    </div>
<script src="{{ site.baseurl }}/scripts/login.js"></script>
