desc "Build the website from source"
task :build do
  puts "## Building website"
  status = system("middleman build --clean")
  puts status ? "OK" : "FAILED"
end

desc "Deploy site to PWS"
task :pws_deploy => :build do
  system("cf push contendr -m 64M -p build/ -b https://github.com/cloudfoundry-incubator/staticfile-buildpack.git")
end

# desc "Build and deploy website"
# task :gen_deploy => [:build, :deploy] do
# end