<template>
    <section class="auth-page d-flex justify-content-center min-vh-100 align-items-center position-relative">
      <div class="container">
        <div class="row justify-content-start align-items-center">
          <div class="col-md-5 col-lg-4">
            <div class="form-box  p-3 text-white rounded-2 m-auto border">
              <div class="text-center"><router-link to="/" class="navbar-brand py-0"><img src="../../assets/logo.png" height="90" /></router-link>
              </div>
                <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </section>
</template>
<script>
 export default{
    name: "AuthLayout"
}
</script>