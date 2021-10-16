from synesthesia_server import create_syn_scene
import synesthesia_server

variables = synesthesia_server.variables
create_syn_scene = synesthesia_server.create_syn_scene


class Test_Synesthesia_server_Create_syn_scene:
    def test_create_syn_scene_1(self):
        create_syn_scene(variables=variables)

    def test_create_syn_scene_2(self):
        create_syn_scene(
            variables=variables[0])

    def test_create_syn_scene_3(self):
        create_syn_scene(
            variables=variables[0][0])

    def test_create_syn_scene_4(self):
        create_syn_scene('syn_Level')

    def test_create_syn_scene_5(self):
        create_syn_scene(variables=variables[0:5])

    def test_create_syn_scene_6(self):
        create_syn_scene(variables=variables[0:6])

    def test_create_syn_scene_7(self):
        create_syn_scene(variables=variables[0:7])
